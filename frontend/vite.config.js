import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_AUTH0_DOMAIN': JSON.stringify(process.env.REACT_APP_AUTH0_DOMAIN),
    'process.env.REACT_APP_AUTH0_CLIENT_ID': JSON.stringify(process.env.REACT_APP_AUTH0_CLIENT_ID)
  }
  
})
