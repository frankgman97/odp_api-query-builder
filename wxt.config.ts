import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'ipOS - ODP Query Builder',
    description:
      'Build structured Lucene queries for the USPTO Open Data Portal patent search API without memorizing field paths or syntax.',
    version: '1.0.0',
    permissions: ['sidePanel', 'storage'],
    icons: {
      '16': 'icon/16.png',
      '32': 'icon/32.png',
      '48': 'icon/48.png',
      '128': 'icon/128.png',
    },
  },
});
