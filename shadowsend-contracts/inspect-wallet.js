import { mnemonicToSeed } from 'bip39';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

const MNEMONIC = 'candy aware sorry below country basic anxiety surface drama add rebel warrior crunch target pig devote price siren cargo planet tag this magnet robust';

async function run() {
    console.log('🔍 Inspecting Wallet object...');
    setNetworkId('preprod');
    const seed = await mnemonicToSeed(MNEMONIC);
    const hexSeed = seed.toString('hex').substring(0, 64);

    const wallet = await WalletBuilder.buildFromSeed(
        'https://indexer.preprod.midnight.network/api/v4/graphql',
        'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
        'http://localhost:6300',
        'https://rpc.preprod.midnight.network',
        hexSeed,
        2,
        'info'
    );

    console.log('\n--- Wallet Properties ---');
    console.log(Object.getOwnPropertyNames(wallet));
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(wallet)));
    
    console.log('\n--- Wallet State ---');
    // We won't start it, just inspect class structure
    
    process.exit(0);
}

run().catch(console.error);
