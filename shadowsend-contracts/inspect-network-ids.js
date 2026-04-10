import * as zswap from '@midnight-ntwrk/zswap';

console.log('🔍 Inspecting @midnight-ntwrk/zswap exports...');
console.log('NetworkId:', zswap.NetworkId);

if (zswap.NetworkId) {
    console.log('Undeployed:', zswap.NetworkId.Undeployed);
    console.log('DevNet:', zswap.NetworkId.DevNet);
    console.log('TestNet:', zswap.NetworkId.TestNet);
    console.log('MainNet:', zswap.NetworkId.MainNet);
    
    // Check if there are other keys
    console.log('All keys:', Object.keys(zswap.NetworkId));
} else {
    console.log('❌ NetworkId is not exported from zswap directly.');
}

import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
try {
    console.log('Current Global NetworkId:', getNetworkId());
} catch (e) {
    console.log('Global NetworkId not set.');
}
