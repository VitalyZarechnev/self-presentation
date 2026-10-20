import react from '@vitejs/plugin-react';
import { defineConfig, Plugin } from 'vitest/config';

// Next imports SVGs as React components through @svgr/webpack; tests get a plain <svg> with the same props.
const svgComponentStub: Plugin = {
  name: 'svg-component-stub',
  enforce: 'pre',
  load(id) {
    if (!/\.svg$/.test(id)) return null;
    return "import { createElement } from 'react'; export default function Svg(props) { return createElement('svg', props); }";
  },
};

export default defineConfig({
  plugins: [svgComponentStub, react()],
  resolve: {
    // Native tsconfig path resolution (replaces vite-tsconfig-paths plugin).
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
});
