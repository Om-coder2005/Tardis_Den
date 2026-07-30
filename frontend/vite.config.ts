import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('zustand') || id.includes('react-router')) return 'vendor';
            if (id.includes('framer-motion')) return 'animations';
            if (id.includes('lucide-react') || id.includes('@uiw/react-md-editor')) return 'ui';
            if (id.includes('react-webcam') || id.includes('react-rnd') || id.includes('react-zoom-pan-pinch')) return 'tools';
            return 'deps';
          }
        }
      }
    }
  }
})
