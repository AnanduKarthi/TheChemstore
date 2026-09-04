import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // Dev-only proxy so the browser talks to the deployed backend without
      // hitting CORS. Set VITE_API_BASE_URL=/api and VITE_PROXY_TARGET to the
      // backend origin (e.g. https://the-chem-store-backend.onrender.com) in
      // .env.local to route local dev traffic to a remote backend for testing.
      proxy: env.VITE_PROXY_TARGET
        ? {
            '/api': {
              target: env.VITE_PROXY_TARGET,
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },
    build: {
      target: 'esnext',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router'],
            ui: ['lucide-react']
          }
        }
      }
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
