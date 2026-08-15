import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // Video and .riv files are copied from public/ as-is, never inlined.
    assetsInlineLimit: 4096,
  },
});
