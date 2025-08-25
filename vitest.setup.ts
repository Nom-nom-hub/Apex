// vitest.setup.ts
import { webcrypto } from 'node:crypto'

// Polyfill for crypto.getRandomValues
Object.defineProperty(globalThis, 'crypto', {
  value: webcrypto
})