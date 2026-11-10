import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    open: false,
    // ✅ Overlay HMR laissé actif pour voir les erreurs en dev
    // (avant : hmr.overlay: false masquait les erreurs)
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    // ✅ Optimisation : sépare les gros vendors
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react'],
        },
      },
    },
    // ✅ Avertit seulement si un chunk dépasse 1 Mo
    chunkSizeWarningLimit: 1000,
  },

  // ✅ Optimise le pré-bundling des dépendances lourdes
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
})