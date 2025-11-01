import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default ({ mode }) => {
  // Load env file based on current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@config': path.resolve(__dirname, './src/config'),
        '@store': path.resolve(__dirname, './src/store'),
        '@theme': path.resolve(__dirname, './src/theme'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@constants': path.resolve(__dirname, './src/utils/constants.js'),
  
        // your aliases
        stream: 'stream-browserify',
        crypto: 'crypto-browserify',
        http: 'stream-http',
        https: 'https-browserify',
        os: 'os-browserify/browser',
        url: 'url/',
        buffer: 'buffer/',
        process: 'process/browser',
        assert: 'assert/',
        util: 'util/',
        events: 'events',
      },
    },
    define: {
      global: 'globalThis',
      'process.env': {}, // keep empty or remove if causing problems
      __BASEAPIURL__: JSON.stringify(env.VITE_APIURL),
      __CONTRACT_ADDR__: JSON.stringify(env.VITE_CONTRACT_ADDR),
      __CHAINID__: JSON.stringify(env.VITE_CHAINID),
      __BSCURL__: JSON.stringify(env.VITE_BSCURL),
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    build: {
      outDir: 'build', // change output folder name
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
    },
  });
};
