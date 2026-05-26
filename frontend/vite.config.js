import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const replaceApiUrlPlugin = () => {
    return {
      name: 'replace-api-url',
      transform(code, id) {
        if (id.includes('/src/') && (id.endsWith('.js') || id.endsWith('.jsx'))) {
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
    plugins: [react(), tailwindcss(), replaceApiUrlPlugin()],
    build: {
      minify: false, 
      cssMinify: false, 
      sourcemap: false
    }
  };
})
