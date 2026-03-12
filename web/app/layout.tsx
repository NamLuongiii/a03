import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Providers} from "./components/providers";

// 1. Thêm các import cần thiết cho Hydration
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {cookies} from "next/headers";
import {getAuthMe, ModelsAccount} from "@/app/api";

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"]});
const geistMono = Geist_Mono({variable: "--font-geist-mono", subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Đọc Luôn - Đọc sách online",
    description: "Nền tảng đọc sách trực tuyến tối ưu SEO",
};

export default async function RootLayout({children}: { children: React.ReactNode }) {
    // 2. Khởi tạo QueryClient ở phía Server
    const queryClient = new QueryClient();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // 3. Nếu có token, tiến hành Prefetch dữ liệu User
    if (token) {
        console.log("Token found, prefetching user data", token);
        try {
            await queryClient.prefetchQuery({
                queryKey: ["me"],
                queryFn: async () => {
                    const {data} = await getAuthMe({
                        headers: {
                            Authorization: token,
                        },
                    });
                    return data?.data as ModelsAccount | null;
                },
            });
        } catch (error) {
            console.error("Lỗi prefetch user:", error);
            // Không làm gì cả, user sẽ ở trạng thái null ở client
        }
    }

    return (
        <html lang="vi" className="light">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <Providers>
            {/* 4. Bao bọc bằng HydrationBoundary để truyền dữ liệu xuống Client */}
            <HydrationBoundary state={dehydrate(queryClient)}>
                {children}
            </HydrationBoundary>
        </Providers>
        </body>
        </html>
    );
}