import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import history from 'connect-history-api-fallback';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // change the host based on your needs, this is set for the demo of todo app
  server: {
    middlewareMode: false,
    setupMiddlewares: (middlewares) => {
      middlewares.use(history());
      return middlewares;
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
