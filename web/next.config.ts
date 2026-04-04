import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'book.docluon.com',
                port: '',
                pathname: '/book-covers/**', // Cho phép tất cả ảnh trong folder này
            },
        ],
    },
    devIndicators: false,
};

export default nextConfig;
