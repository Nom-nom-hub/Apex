// vitest.setup.ts
// Polyfill for crypto.getRandomValues in Node.js environment
const crypto = require('node:crypto');

// Define crypto on globalThis if it doesn't exist
if (!globalThis.crypto) {
  globalThis.crypto = {
    getRandomValues: (array: any) => {
      return crypto.randomFillSync(array);
    }
  };
}