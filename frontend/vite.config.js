import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Automatically load env variables from the current working directory
  const env = loadEnv(mode, process.cwd(), '')

  const replaceApiUrlPlugin = () => {
    return {
      name: 'replace-api-url',
      enforce: 'pre',
      transform(code, id) {
        // Find and replace localhost in any source file automatically before transpilation
        if (code.includes('http://localhost:5000')) {
          const targetUrl = env.VITE_API_URL || 'https://saas-platform-backend-em4s.onrender.com';
          return {
            code: code.replaceAll('http://localhost:5000', targetUrl),
            map: null
          };
        }
      }
    };
  };

  return {
    plugins: [replaceApiUrlPlugin(), react(), tailwindcss()],
    build: {
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: false,
      target: 'es2015',
      rollupOptions: {
        output: {
          // Granular chunk splitting to minimize unused JS on initial load
          manualChunks(id) {
            // Heavy chat-only libraries – only loaded when chat pages are visited
            if (id.includes('emoji-picker-react')) return 'emoji-picker';
            if (
              id.includes('socket.io-client') ||
              id.includes('engine.io-client') ||
              id.includes('socket.io-parser')
            ) return 'socket-io';
            // Animation library used on LandingPage
            if (id.includes('framer-motion')) return 'framer-motion';
            // Icon library – used everywhere, keep in vendor
            if (id.includes('lucide-react')) return 'lucide';
            // Core React runtime
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/scheduler/')
            ) return 'react-core';
            // Router
            if (id.includes('react-router')) return 'router';
            // Everything else from node_modules
            if (id.includes('node_modules')) return 'vendor';
          }
        }
      }
    }
  };
})
