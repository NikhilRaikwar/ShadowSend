import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { NetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-types'; // Typical location for NetworkId in this version
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto } from 'node:crypto';

async function generate() {
  console.log('🌌 Generating a NEW Wallet for ShadowSend...');

  // 1. Create 32-byte hex seed
  const bytes = new Uint8Array(32);
  webcrypto.getRandomValues(bytes);
  const seed = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');

  // 2. Setup standard Preprod endpoints
  const indexer = 'https://indexer.preprod.midnight.network/api/v1/graphql';
  const indexerWS = 'wss://indexer.preprod.midnight.network/api/v1/graphql/ws';
  const node = 'https://rpc.preprod.midnight.network';
  const proofServer = 'http://127.0.0.1:6300';
  
  console.log('⏳ Deriving address (please wait)...');
  
  // 3. Build wallet briefly to get the address
  // In v5.0.0, we use buildFromSeed
  const wallet = await WalletBuilder.buildFromSeed(
    indexer,
    indexerWS,
    proofServer,
    node,
    seed,
    1, // Preprod/Testnet ID usually 1
    'info'
  );

  const state = await new Promise((resolve) => {
    const sub = wallet.state().subscribe((s) => {
      if (s.address) {
        sub.unsubscribe();
        resolve(s);
      }
    });
  });

  const address = (state as any).address;
  await wallet.close();

  // 4. Update .env file
  const envPath = path.join(process.cwd(), '.env');
  const envContent = `WALLET_SEED=${seed}\nWALLET_ADDRESS=${address}\nNETWORK=preprod\n`;
  
  fs.writeFileSync(envPath, envContent);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ NEW WALLET SAVED TO .env');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('💰 Public Wallet Address (FUND THIS):');
  console.log('\x1b[32m%s\x1b[0m', address);
  
  console.log('\n🔐 Seed Phrase (Saved to WALLET_SEED in .env):');
  console.log('\x1b[33m%s\x1b[0m', seed);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. Go to: faucet.midnight.network');
  console.log('2. Select: Preprod');
  console.log('3. Paste the green address above');
  console.log('4. Once funded, run: npx ts-node contracts/src/deploy.ts');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

generate().catch(console.error);
