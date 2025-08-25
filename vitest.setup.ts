// vitest.setup.ts
// Mock crypto.getRandomValues for Node.js environment
const crypto = require('node:crypto');

if (!global.crypto) {
  global.crypto = {
    getRandomValues: (array: any) => {
      return crypto.randomFillSync(array);
    }
  } as any;
} else if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = (array: any) => {
    return crypto.randomFillSync(array);
  };
}