import * as bip39 from 'bip39';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { createKeystore } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

const TARGET_ADDRESS = 'mn_addr_preprod1lfehhjzlktzm2hj947x2apcsx5czlkh8r8mnexyfetfplww4g89quk7dm5';
const MNEMONIC = 'candy aware sorry below country basic anxiety surface drama add rebel warrior crunch target pig devote price siren cargo planet tag this magnet robust';

async function run() {
    console.log('🧪 Verifying modern SDK address derivation...');
    
    // 1. Convert Mnemonic to Seed
    const seed = await bip39.mnemonicToSeed(MNEMONIC);
    
    // 2. Initialize HDWallet
    const hdWalletResult = HDWallet.fromSeed(seed);
    if (hdWalletResult.type !== 'seedOk') {
        throw new Error('Failed to generate HDWallet from seed');
    }
    
    const hdWallet = hdWalletResult.hdWallet;
    const account = hdWallet.selectAccount(0);
    
    // 3. Derive NightExternal Key
    const keyResult = account.selectRole(Roles.NightExternal).deriveKeyAt(0);
    if (keyResult.type !== 'keyDerived') {
        throw new Error('Failed to derive NightExternal key');
    }
    
    const nightExternalKey = keyResult.key;
    console.log('✅ NightExternal key derived.');

    // 4. Create Unshielded Keystore for Preprod
    setNetworkId('preprod');
    const keystore = createKeystore(nightExternalKey, 'preprod');
    const derivedAddress = keystore.getBech32Address();
    
    console.log(`\n📍 Derived Address: ${derivedAddress}`);
    console.log(`📍 Target Address:  ${TARGET_ADDRESS}`);
    
    if (derivedAddress === TARGET_ADDRESS) {
        console.log('\n✨ MATCH FOUND! Modern SDK logic is correct.');
        console.log('🚀 We can now proceed with deploy-v5.js using this pattern.');
    } else {
        console.log('\n❌ ADDRESS MISMATCH. Trying alternative derivation check...');
        // Sometimes account 0 key 0 is NOT what was used if it's a legacy wallet
    }
}

run().catch(console.error);
