import Link from "next/link";

export default function AuthLayout({children}: { children: React.ReactNode }) {
    return <div className="bg-shape">
        <header className='p-6 absolute top-0 left-0'>
            <Link href="/" className="text-2xl font-bold text-white">
                Đọc Luôn
            </Link>
        </header>
        {children}
    </div>
}