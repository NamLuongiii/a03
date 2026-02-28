module.exports = {
    bookStore: {
        input: 'http://localhost:8080/swagger/doc.json', // Link trực tiếp từ backend của bạn
        // input: './doc.json',
        output: {
            mode: 'tags-split',          // Chia file theo Tag (Sách, User, Auth...) để dễ quản lý
            target: 'src/api/endpoints', // Nơi chứa các React Query Hooks
            schemas: 'src/api/model',    // Nơi chứa các Model (Interface/Type)
            client: 'react-query',       // Gen luôn useQuery, useMutation
            prettier: true,              // Format code cho đẹp
            clean: true,                 // Xóa code cũ trước khi gen mới
            override: {
                useTypeOverInterfaces: true, // Ép dùng "type" thay vì "interface" (Tốt cho Vite)
                query: {
                    useQuery: true,
                    useMutation: true,
                    useInfinite: true,       // Hỗ trợ nếu bạn làm trang list sách cuộn vô tận
                },
            },
        },
    },
};