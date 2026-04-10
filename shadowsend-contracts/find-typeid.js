import * as Shadowsend from './boilerplate/contract/dist/index.js';
import { TypeId } from '@midnight-ntwrk/compact-js/dist/esm/effect/internal/compactContext.js';

console.log('🔍 Searching for TypeId in Shadowsend module...');

function search(obj, path = 'Shadowsend') {
    if (!obj || typeof obj !== 'object' && typeof obj !== 'function') return;
    
    if (obj[TypeId]) {
        console.log(`✅ FOUND TypeId at: ${path}`);
    }
    
    for (const key of Object.getOwnPropertyNames(obj)) {
        try {
            search(obj[key], `${path}.${key}`);
        } catch (e) {}
    }
}

search(Shadowsend);

console.log('--- Search Finished ---');
