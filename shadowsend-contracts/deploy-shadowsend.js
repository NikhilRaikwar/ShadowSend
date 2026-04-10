import { WebSocket } from 'ws';
// @ts-expect-error: Required for wallet sync in Node.js
globalThis.WebSocket = WebSocket;

import { mnemonicToSeed } from '@scure/bip39';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import * as ledger from '@midnight-ntwrk/ledger-v8';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import {
  createKeystore,
  InMemoryTransactionHistoryStorage,
  PublicKey,
  UnshieldedWallet,
} from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { firstValueFrom } from 'rxjs';
import { filter, throttleTime, timeout, catchError, first } from 'rxjs/operators';
import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Buffer } from 'buffer';

// --- CONFIGURATION ---
const NETWORK_ID = 'preprod';
const INDEXER_URL = 'https://indexer.preprod.midnight.network/api/v3/graphql';
const INDEXER_WS_URL = 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws';
const RPC_WS_URL = 'wss://rpc.preprod.midnight.network';
const RPC_URL = 'https://rpc.preprod.midnight.network';
const PROOF_SERVER_URL = 'http://127.0.0.1:6300';
const MNEMONIC = 'candy aware sorry below country basic anxiety surface drama add rebel warrior crunch target pig devote price siren cargo planet tag this magnet robust';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deploy() {
  console.log('🚀 Starting ShadowSend Deployment to Midnight Preprod (Stall-Resistant v3)...');

  // 1. Set Network ID
  setNetworkId(NETWORK_ID);
  console.log(`📡 Network: ${NETWORK_ID}`);

  // 2. Derive Keys from Mnemonic (@scure/bip39)
  console.log('🔐 Deriving keys...');
  const seedBuffer = await mnemonicToSeed(MNEMONIC.trim());
  const seed = Buffer.from(seedBuffer);

  const hdResult = HDWallet.fromSeed(seed);
  if (hdResult.type !== 'seedOk') {
    throw new Error(`Failed to initialize HDWallet: ${hdResult.type}`);
  }

  const derivationResult = hdResult.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);

  if (derivationResult.type !== 'keysDerived') {
    throw new Error(`Failed to derive keys: ${derivationResult.type}`);
  }
  const keys = derivationResult.keys;
  hdResult.hdWallet.clear();
  console.log('✅ Keys derived');

  // 3. Create typed secret keys and public keys
  const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(keys[Roles.Zswap]);
  const dustSecretKey = ledger.DustSecretKey.fromSeed(keys[Roles.Dust]);
  const keystore = createKeystore(keys[Roles.NightExternal], NETWORK_ID);
  const walletAddress = keystore.getBech32Address();
  const publicKey = PublicKey.fromKeyStore(keystore);

  console.log(`🏠 Wallet Address: ${walletAddress}`);

  // 4. Wallet configuration
  const walletConfig = {
    networkId: NETWORK_ID,
    indexerClientConnection: {
      indexerHttpUrl: INDEXER_URL,
      indexerWsUrl: INDEXER_WS_URL,
    },
    relayURL: new URL(RPC_WS_URL),
    provingServerUrl: new URL(PROOF_SERVER_URL),
    costParameters: {
      additionalFeeOverhead: 300_000_000_000_000n,
      feeBlocksMargin: 5,
    },
    txHistoryStorage: new InMemoryTransactionHistoryStorage(),
  };

  // 5. Initialize WalletFacade
  console.log('💳 Initializing WalletFacade...');
  const wallet = await WalletFacade.init({
    configuration: walletConfig,
    shielded: (cfg) => ShieldedWallet(cfg).startWithSecretKeys(shieldedSecretKeys),
    unshielded: (cfg) => UnshieldedWallet(cfg).startWithPublicKey(publicKey),
    dust: (cfg) => DustWallet(cfg).startWithSecretKey(
      dustSecretKey,
      ledger.LedgerParameters.initialParameters().dust
    )
  });

  await wallet.start(shieldedSecretKeys, dustSecretKey);
  console.log('✅ Wallet started. Waiting for sync...');

  // 5.5 Precise Network Height (Hardcoded Explorer Tip)
  const totalBlocks = 293163;
  console.log(`🌍 Network Tip: ${totalBlocks}`);

  // 6. Sync Logging with Auto-Refresh Logic
  let lastIndex = -1;
  let stallCount = 0;
  const syncSub = wallet.state().pipe(throttleTime(10000)).subscribe(s => {
      const prog = s.shielded?.state?.progress;
      if (prog) {
          const applied = Number(prog.appliedIndex || 0);
          const highest = totalBlocks || Number(prog.highestIndex || 0);
          const pct = Math.min(99, highest > 0 ? Math.round((applied / highest) * 100) : 0);
          
          if (applied !== lastIndex) {
              console.log(`⏳ Progress: ${s.isSynced ? 100 : pct}% (${applied}/${highest}) - Connected: ${prog.isConnected}`);
              lastIndex = applied;
              stallCount = 0;
          } else if (applied > 0) {
              stallCount++;
              if (stallCount % 6 === 0) { // Every 1 minute of stalling
                  console.log(`🚧 Still at ${applied}... connection is active but data is slow. Check Explorer.`);
              }
          }
      }
  });

  // Wait for isSynced with a hard 10-minute limit
  const state = await firstValueFrom(
    wallet.state().pipe(
      filter((s) => s.isSynced),
      timeout(600 * 1000), // 10 minute total sync wait
      catchError(err => {
          console.log('⚠️ Sync timeout hit or stall detected. Attempting to proceed to deployment phase...');
          return wallet.state().pipe(first());
      })
    )
  );
  
  syncSub.unsubscribe();
  console.log('🚀 Finalizing sync check... Wallet synced state: ' + state.isSynced);

  // 7. Check DUST balance
  const dustBalance = state.dust.walletBalance(new Date());
  console.log(`💰 DUST Balance: ${dustBalance}`);

  if (dustBalance === 0n) {
    console.log('⚠️ DUST Balance in wallet is 0. If you just funded it, wait a bit longer or sync is incomplete.');
    console.log('💡 Attempting to proceed anyway (balancing might fail if indexer is missing UTXOs).');
  }

  // 8. Set up providers
  const zkConfigProvider = new NodeZkConfigProvider(
    path.resolve(__dirname, 'boilerplate/contract/dist/managed/shadowsend')
  );

  const walletProvider = {
    balanceTx: async (tx, ttl) => {
      console.log('⚖️ Balancing transaction (this requires synced UTXOs)...');
      const ttlDate = ttl ?? new Date(Date.now() + 60 * 60 * 1000);
      const recipe = await wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys, dustSecretKey },
        { ttl: ttlDate }
      );
      return await wallet.finalizeRecipe(recipe);
    },
    getCoinPublicKey: () => publicKey,
    getEncryptionPublicKey: () => publicKey,
  };

  const providers = {
    publicDataProvider: indexerPublicDataProvider(INDEXER_URL, INDEXER_WS_URL),
    proofProvider: httpClientProofProvider(PROOF_SERVER_URL, zkConfigProvider),
    zkConfigProvider,
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'shadowsend-deployment-state',
      privateStoragePasswordProvider: () =>
        Promise.resolve('shadowsend-deployment-pass-xyz789!'),
    }),
    walletProvider,
    midnightProvider: {
      submitTx: (tx) => wallet.submitTransaction(tx),
    },
  };

  // 9. Load compiled contract
  console.log('📦 Loading ShadowSend contract...');
  const { contracts } = await import('./boilerplate/contract/dist/index.js');
  const { witnesses, createInitialState } = await import('./boilerplate/contract/dist/witnesses.js');
  const CompiledContract = await import('@midnight-ntwrk/compact-js/effect/CompiledContract');
  
  const Shadowsend = contracts.Shadowsend;
  const compiled = CompiledContract.withWitnesses(
      CompiledContract.make('shadowsend', Shadowsend.Contract), 
      witnesses
  );

  // 10. Deploy
  console.log('🚢 Deploying ShadowSend to Preprod...');
  try {
    const deployed = await deployContract(providers, {
      compiledContract: compiled,
      privateStateId: 'shadowsendPrivateState',
      initialPrivateState: createInitialState(),
    });

    const contractAddress = deployed.deployTxData.public.contractAddress;
    console.log(`\n🎉 SUCCESS! ShadowSend deployed at: ${contractAddress}`);

    fs.writeFileSync(
      path.resolve(__dirname, 'contract-address.json'),
      JSON.stringify({ address: contractAddress, network: NETWORK_ID }, null, 2)
    );
  } catch (err) {
    console.error('\n❌ Deployment Step Failed:', err?.message ?? err);
    if (err?.message?.includes('balance')) {
        console.log('💡 Rationale: Balancer could not find enough funds. This is usually because the Indexer is still behind (at block 73k) and hasn\'t seen your faucet deposit yet.');
    }
  }

  await wallet.stop();
  process.exit(0);
}

deploy().catch((err) => {
  console.error('\n❌ Fatal Error:', err?.message ?? err);
  process.exit(1);
});
