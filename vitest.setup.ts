// vitest.setup.ts
// Mock crypto.getRandomValues for Node.js environment
if (!global.crypto) {
  global.crypto = {
    getRandomValues: (array: any) => {
      if (typeof require !== 'undefined') {
        const crypto = require('node:crypto');
        return crypto.randomFillSync(array);
      }
      return array;
    }
  } as any;
} else if (!global.crypto.getRandomValues) {
  if (typeof require !== 'undefined') {
    const crypto = require('node:crypto');
    global.crypto.getRandomValues = (array: any) => {
      return crypto.randomFillSync(array);
    };
  } else {
    global.crypto.getRandomValues = (array: any) => array;
  }
}