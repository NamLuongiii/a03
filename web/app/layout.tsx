import type {Metadata} from "next";
import {Be_Vietnam_Pro} from "next/font/google";
import "./globals.css";
import {Providers} from "./components/providers";
import NextTopLoader from "nextjs-toploader";
import {ThemeProvider} from "next-themes";

// Cấu hình font
const beVietnamPro = Be_Vietnam_Pro({
    weight: ['400', '500', '600', '700'],
    subsets: ['vietnamese'],
    display: 'swap',
    variable: '--font-be-vietnam', // Đặt biến CSS
});

export const metadata: Metadata = {
    title: "Đọc Luôn - Đọc sách online",
    description: "Nền tảng đọc sách trực tuyến tối ưu SEO",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="vi" className="light">
        <body className={beVietnamPro.className}>
        <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
        />
        <ThemeProvider>
            <Providers>
                {children}
            </Providers>
        </ThemeProvider>
        </body>
        </html>
    );
}