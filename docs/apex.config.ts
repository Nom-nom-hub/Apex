import { defineConfig } from '@apex/core'

export default defineConfig({
  renderer: '@apex/renderer-react',
  routes: './app/routes',
  islands: './app/components'
})