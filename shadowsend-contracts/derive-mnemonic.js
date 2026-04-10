import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { firstValueFrom } from 'rxjs';

async function deriveFromMnemonic() {
  // Your 24-word phrase
  const mnemonic = 'candy aware sorry below country basic anxiety surface drama add rebel warrior crunch target pig devote price siren cargo planet tag this magnet robust';
  
  console.log('🌙 Deriving address from Mnemonic (Preprod)...');

  try { setNetworkId('preprod'); } catch (e) {}

  const config = {
    indexer: 'https://indexer.preprod.midnight.network/api/v1/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v1/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    proofServer: 'http://127.0.0.1:6300'
  };

  try {
    // In v5.0.0, buildFromSeed might accept the phrase or we derive the seed first.
    // If it's a standard builder, it usually handles the mnemonic directly or we use a helper.
    const wallet = await WalletBuilder.buildFromSeed(
      config.indexer, config.indexerWS, config.proofServer, config.node,
      mnemonic, // Passing mnemonic directly
      1, 
      'error'
    );

    wallet.start();
    await new Promise(resolve => setTimeout(resolve, 5000));
    const state = await firstValueFrom(wallet.state());
    await wallet.close();

    console.log('\n💎 YOUR PREPROD ADDRESS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Address: ${state.unshieldedAddress || state.scanningAddress || state.address}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

deriveFromMnemonic();
