module.exports = {
    bookStore: {
        input: 'http://localhost:8080/swagger/doc.json',
        output: {
            mode: 'tags-split',
            target: 'src/api/endpoints',
            schemas: 'src/api/model',
            client: 'react-query',
            httpClient: 'axios',
            prettier: true,
            clean: true,
            override: {
                useTypeOverInterfaces: true,
                mutator: {
                    path: './src/api/axios-instance.ts', // Đường dẫn đến file ở Bước 1
                    name: 'customInstance',             // Tên hàm export trong file đó
                },
                query: {
                    useQuery: true,
                    useMutation: true,
                    useInfinite: true,
                },
            },
        },
    },
};