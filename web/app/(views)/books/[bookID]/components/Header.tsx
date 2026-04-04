'use client'
import React, {useEffect, useState} from 'react';
import {ModelsBook} from "@/app/api";
import {Button} from "@heroui/react";
import Link from "next/link";

type Props = {
    book: ModelsBook
}

const Header = ({book}: Props) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Ngưỡng 200px để kích hoạt hiện header
            setIsVisible(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full bg-white border-b z-50 transition-all duration-300 p-4 py-2 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <div className="flex items-center justify-between h-16 px-4">
                {/* Tên sách: sử dụng truncate để không làm vỡ layout khi tên quá dài */}
                <div>
                    <h2 className="font-bold truncate mr-4">{book?.name}</h2>
                    <small>{book.author?.name}</small>
                </div>


                {/* Nút Đọc ngay */}
                <Link href={`/read/${book.id}`}>
                    <Button type='button'>
                        Đọc ngay
                    </Button>
                </Link>
            </div>
        </header>
    );
};

export default Header;