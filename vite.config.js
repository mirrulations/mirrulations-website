import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_');

    return {
        plugins: [react()],
        resolve: {
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
            }
        }
    };
});
