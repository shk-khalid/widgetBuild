import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
  const isWidget = mode === 'widget';

  if (isWidget) {
    return {
      define: {
        'process.env': {},
      },
      plugins: [
        react(),
        cssInjectedByJsPlugin(),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
      optimizeDeps: {
        exclude: ['lucide-react'],
      },
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/entry-widget.tsx'),
          name: 'ShopifyWidgets',
          formats: ['iife'],
          fileName: () => 'widget.js',
        },
        cssCodeSplit: false,
        rollupOptions: {
          external: [],
          output: {},
        },
      },
    };
  }

  // Full application build
  return {
    define: {
      'process.env': {},
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'dist-app', // different output folder
      sourcemap: true,
    },
  };
});
