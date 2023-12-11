import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro'
import manifest from './src/manifest.json' assert { type: 'json'}

// https://astro.build/config
export default defineConfig({
  integrations: [AstroPWA({
    registerType: 'autoUpdate',
    manifest,
    workbox: {
      clientsClaim: true,
      skipWaiting: true
    },
    devOptions: {
      enabled: true
    }
  })],
  site: 'https://cv.danielbeeke.nl',
})