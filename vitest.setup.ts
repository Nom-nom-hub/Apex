// vitest.setup.ts
// Polyfill for crypto.getRandomValues in Node.js environment
const nodeCrypto = require('node:crypto');

// Define crypto on globalThis if it doesn't exist or doesn't have getRandomValues
if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      getRandomValues: (array: any) => {
        return nodeCrypto.randomFillSync(array);
      }
    },
    writable: true,
    configurable: true
  });
}