import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Cible les navigateurs modernes pour un bundle plus léger
    target: 'es2020',
    // Augmente le seuil d'avertissement (les chunks admin sont légitimement gros)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — change rarement, cache navigateur durable
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Framer-motion — lourd (~100 KB gz), isolé pour le cache
          'vendor-motion': ['framer-motion'],
          // Lucide icons
          'vendor-icons': ['lucide-react'],
          // Supabase — chargé uniquement quand nécessaire
          'vendor-supabase': ['@supabase/supabase-js'],
          // Date-fns — utilitaires date
          'vendor-date': ['date-fns'],
        },
      },
    },
  },
})
