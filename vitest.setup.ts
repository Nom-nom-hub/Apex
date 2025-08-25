// vitest.setup.ts
import crypto from 'crypto-browserify'

// Polyfill for crypto.getRandomValues
global.crypto = crypto as any