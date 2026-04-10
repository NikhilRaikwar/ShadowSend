import * as bip39 from 'bip39';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { firstValueFrom } from 'rxjs';
import dotenv from 'dotenv';
import crypto from 'node:crypto';

dotenv.config();

const TARGET_ADDRESS = 'mn_addr_preprod1lfehhjzlktzm2hj947x2apcsx5czlkh8r8mnexyfetfplww4g89quk7dm5';
const MNEMONIC = 'candy aware sorry below country basic anxiety surface drama add rebel warrior crunch target pig devote price siren cargo planet tag this magnet robust';

async function test(seedHex, label) {
    console.log(`🔍 Testing ${label}...`);
    try {
        const wallet = await WalletBuilder.buildFromSeed(
            'https://indexer.preprod.midnight.network/api/v1/graphql',
            'wss://indexer.preprod.midnight.network/api/v1/graphql/ws',
            'http://localhost:6300',
            'https://rpc.preprod.midnight.network',
            seedHex,
            2,
            'error'
        );
        wallet.start();
        await new Promise(r => setTimeout(r, 3000));
        const state = await firstValueFrom(wallet.state());
        console.log(`   📍 Available Keys: ${Object.keys(state).join(', ')}`);
        console.log(`   📍 Shielded:   ${state.address}`);
        console.log(`   📍 Unshielded: ${state.unshieldedAddress || state.scanningAddress || 'N/A'}`);
        
        const possibleAddresses = [state.address, state.unshieldedAddress, state.scanningAddress];
        if (possibleAddresses.includes(TARGET_ADDRESS)) {
            console.log(`   ✅ MATCH FOUND! Use ${label} as WALLET_SEED`);
            process.exit(0);
        }
        await wallet.close();
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}`);
    }
}

async function run() {
    console.log('🧪 Starting Derivation Brute-force...');

    // Try 1: BIP39 Entropy (32 bytes hex) - Most common for simple apps
    const entropy = bip39.mnemonicToEntropy(MNEMONIC);
    await test(entropy, 'BIP39 Entropy (32 bytes)');

    // Try 2: First 32 bytes of BIP39 Seed (64 bytes hex)
    const fullSeed = bip39.mnemonicToSeedSync(MNEMONIC).toString('hex');
    const first32 = fullSeed.substring(0, 64);
    await test(first32, 'BIP39 Seed (First 32 bytes)');

    // Try 3: SHA256 of the mnemonic phrase string
    const hashed = crypto.createHash('sha256').update(MNEMONIC).digest('hex');
    await test(hashed, 'SHA256 of Mnemonic');

    console.log('🏁 No match found in common formats.');
}

run().catch(console.error);
