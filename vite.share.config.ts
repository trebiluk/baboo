import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = dirname(fileURLToPath(import.meta.url));

/** Standalone class-folder pack — relative paths, no server. */
export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: false,
  build: {
    outDir: 'class-folder',
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 400000,
    rollupOptions: {
      input: resolve(root, 'share.html'),
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'assets/baboo.js',
        chunkFileNames: 'assets/baboo.js',
        assetFileNames: 'assets/baboo[extname]',
      },
    },
  },
});
