import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro'
import manifest from './src/manifest.json' assert { type: 'json'}

// https://astro.build/config
export default defineConfig({
  integrations: [AstroPWA({
    injectRegister: 'inline',
    registerType: 'autoUpdate',
    manifest,
    workbox: {
      clientsClaim: true,
      skipWaiting: true
    },
    devOptions: {
      enabled: false
    }
  })],
  site: 'https://cv.danielbeeke.nl',
})