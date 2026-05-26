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
      minify: false, 
      cssMinify: false, 
      sourcemap: false
    }
  };
})
