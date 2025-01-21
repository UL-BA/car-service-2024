import { defineConfig } from 'vite'; // Ensure this import is present
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/services": {
        target: "http://localhost:3000", // Admin service routes
        changeOrigin: true,
      },
      "/api/workshops": {
        target: "http://localhost:3000", // Workshop routes
        changeOrigin: true,
      },
    },
  },
});
