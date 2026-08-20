import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project from https://<user>.github.io/GrupoRaizes/,
// so all built asset URLs must be prefixed with the repo name.
export default defineConfig({
  plugins: [react()],
  base: '/GrupoRaizes/',
});
