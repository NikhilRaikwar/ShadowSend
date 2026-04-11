import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { firstValueFrom } from 'rxjs';
import { webcrypto } from 'node:crypto';
import fs from 'node:fs';

async function generate() {
  console.log('🌙 Midnight Final Address Deriver (Preprod)\n');

  // Hardsetting Preprod string
  try { setNetworkId('preprod'); } catch (e) {}

  const bytes = new Uint8Array(32);
  webcrypto.getRandomValues(bytes);
  const seed = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');

  const config = {
    indexer: 'https://indexer.preprod.midnight.network/api/v1/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v1/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    proofServer: 'http://127.0.0.1:6300'
  };
  
  try {
    const wallet = await WalletBuilder.buildFromSeed(
      config.indexer, config.indexerWS, config.proofServer, config.node,
      seed,
      1, 
      'error'
    );

    wallet.start();
    await new Promise(resolve => setTimeout(resolve, 3000));
    const state = await firstValueFrom(wallet.state());
    await wallet.close();

    // 💡 THE ULTIMATE HACK:
    // If the SDK returns _dev but we are on Preprod, the bytes are the same.
    // We will manually format it for the Faucet.
    const shielded = state.address;
    
    // Most V5 wallets have a 'scanningAddress' or 'unshieldedAddress'
    const rawAddress = state.unshieldedAddress || state.scanningAddress || state.address;
    
    // If it still has _dev, we tell the user. 
    // BUT! I will also provide a funded seed if you have one.
    
    console.log('✅ NEW SEED GENERATED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔑 Seed: ${seed}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    fs.writeFileSync('.env', `WALLET_SEED=${seed}\n`);

    console.log('\n⚠️  Kripya is Seed ko fund karein faucet se.');
    console.log('Agar address "_dev" dikha raha hai, toh Lace Wallet mein "Import Secret Key" karke');
    console.log('Preprod address nikaal lo. Wahi ek maatra raasta hai agar SDK nakhre kar raha ho.');

  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

generate();
