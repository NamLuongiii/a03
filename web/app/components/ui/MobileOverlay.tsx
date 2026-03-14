import React, {useEffect} from 'react';
import {createPortal} from 'react-dom'; // Import Portal
import {Button, CloseIcon} from "@heroui/react";

interface MobileOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const MobileOverlay = ({isOpen, onClose, children}: MobileOverlayProps) => {
    // 1. Khóa cuộn trang khi Menu đang mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // 2. Nếu không mở thì không render gì cả để tối ưu performance
    if (!isOpen) return null;

    // 3. Sử dụng createPortal để đưa UI vào cuối thẻ <body>
    return createPortal(
        <div
            className="fixed inset-0 z-9999 bg-white">
            {/* Header của Overlay */}
            <Button isIconOnly variant="ghost" onClick={onClose} className="absolute top-2 right-2">
                <CloseIcon/>
            </Button>

            {/* Nội dung Menu - Căn giữa toàn bộ */}
            <nav className="p-8 py-16 h-screen overflow-y-auto">
                {children}
            </nav>
        </div>,
        document.body // Đích đến của Portal
    );
};

export default MobileOverlay;