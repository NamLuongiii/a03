import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import {tanstackRouter} from '@tanstack/router-plugin/vite'
import {vanillaExtractPlugin} from "@vanilla-extract/vite-plugin";
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
        }),
        react(),
        vanillaExtractPlugin({})
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
        }
    }
});

