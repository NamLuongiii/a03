import {defineConfig} from '@hey-api/openapi-ts';

export default defineConfig({
    input: '../back/docs/swagger.json',
    output: {
        path: 'app/api/generated',
        format: 'prettier',
        lint: 'eslint',
    },
});