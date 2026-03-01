import {defineConfig} from '@hey-api/openapi-ts';

export default defineConfig({
    input: '../back/docs/swagger.json',
    output: {
        path: 'src/api/generated',
        format: 'prettier',
        lint: 'eslint',
    },
    // Plugin quan trọng để gen ra React Query Hooks và dùng Axios
    plugins: [
        '@hey-api/client-axios',
        {
            name: '@hey-api/sdk',
            // Giúp bạn gọi API theo kiểu: BooksService.createBook()
            asClass: true,
        },
        {
            name: '@tanstack/react-query',
            // Gen ra useQuery, useMutation
        },
    ],
});