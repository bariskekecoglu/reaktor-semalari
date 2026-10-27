/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Göreli yollar: site hangi depo adıyla (kullanici.github.io/<depo>/) yayınlanırsa yayınlansın çalışır.
  base: './',
  plugins: [react()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
