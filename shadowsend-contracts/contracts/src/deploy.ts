import { MidnightJS } from '@midnight-ntwrk/midnight-js';
import { NetworkId } from '@midnight-ntwrk/network-id';
import { WalletBuilder } from '@midnight-ntwrk/wallet'; // Using the standard package
import * as shadowsend from '../../boilerplate/contract/src/managed/shadowsend/contract/index.cjs';
import dotenv from 'dotenv';

dotenv.config();

async function deploy() {
  console.log('🚀 Finalizing ShadowSend Deployment on Preprod...');

  const phrase = process.env.WALLET_SEED;
  const address = process.env.WALLET_ADDRESS;
  
  if (!phrase) throw new Error('WALLET_SEED (Recovery Phrase) is missing in .env');

  // 1. Setup Network Endpoints
  const config = {
    indexer: 'https://indexer.preprod.midnight.network/api/v1/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v1/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    proofServer: 'http://127.0.0.1:6300'
  };

  try {
    console.log('⏳ Connecting to Midnight Wallet via Recovery Phrase...');
    
    // Most V5.0.0 SDKs support the mnemonic string in buildFromSeed
    const wallet = await WalletBuilder.buildFromSeed(
      config.indexer,
      config.indexerWS,
      config.proofServer,
      config.node,
      phrase,
      1, // Preprod ID
      'info'
    );

    wallet.start();
    console.log('🔗 Wallet connected! Deriving address...');
    
    // 2. Deploy the ShadowSend Contract
    console.log('📦 Deploying shadowsend.compact (6 Circuits: Compliance + Shielded + Swaps)...');
    
    const contract = await MidnightJS.deploy(wallet, {
      contract: shadowsend,
      initialState: {
          totalShieldedSends: 0n,
      },
      proofServerUrl: config.proofServer
    });

    console.log('\n✅ DEPLOYMENT SUCCESSFUL! 🥂');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 Contract Address:', contract.address);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚢 ShadowSend is now LIVE on Midnight Preprod!');
    
    await wallet.close();
  } catch (error) {
    console.error('❌ Deployment Failed:', error.message);
    console.log('\n💡 Tip: Check if you have tNIGHT funds in your address.');
  }
}

deploy().catch(console.error);
