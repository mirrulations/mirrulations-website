import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_');

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'javascript'), // Alias to access the javascript folder easily
                'styles': path.resolve(__dirname, 'styles') // Alias to access the styles folder easily
            }
        },
        server: {
            host: 'localhost',
            port: 5500
        },
        build: {
            outDir: 'dist', // Specifies the output directory for the build
        },
        define: {
            'import.meta.env': {
                ...env,
            },
            global: {},
        },
    };
});
