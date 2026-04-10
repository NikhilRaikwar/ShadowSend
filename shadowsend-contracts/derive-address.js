import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { firstValueFrom } from 'rxjs';

async function derive() {
  const seed = '54fc001c2a8e667e484515e9433ddfc01d129b8dfb0da8a210df58579fc4dac2';
  
  // Try to set network to preprod string
  try { setNetworkId('preprod'); } catch (e) {}

  const config = {
    indexer: 'https://indexer.preprod.midnight.network/api/v1/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v1/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    proofServer: 'http://127.0.0.1:6300'
  };

  const wallet = await WalletBuilder.buildFromSeed(
    config.indexer, config.indexerWS, config.proofServer, config.node,
    seed,
    1, // Preprod ID
    'error'
  );

  wallet.start();
  await new Promise(resolve => setTimeout(resolve, 5000));
  const state = await firstValueFrom(wallet.state());
  await wallet.close();

  console.log('\n💎 FOUND ADDRESS FOR YOUR SEED:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Search for the one that is NOT shielded if possible, 
  // or just give all available addresses found in state.
  console.log(`Address: ${state.address}`);
  if (state.unshieldedAddress) console.log(`Unshielded: ${state.unshieldedAddress}`);
  if (state.scanningAddress) console.log(`Scanning: ${state.scanningAddress}`);
  
  // We will also print the state keys to be 100% sure we didn't miss it
  console.log('\nState Keys Found:', Object.keys(state));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

derive();
