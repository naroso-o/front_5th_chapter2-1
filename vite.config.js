import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'src/setupTests.js',
    },
    server: {
        // open: '/index.html', 
        // open: '/index.basic.html', 
        open: '/index.advanced.html', 
    },
});
