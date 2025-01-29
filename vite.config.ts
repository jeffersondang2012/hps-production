import { defineConfig } from 'vite/dist/node';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    // Tắt hoàn toàn TypeScript check khi build
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['chart.js', 'react-chartjs-2']
    }
  },
  define: {
    'process.env': process.env
  }
}); 