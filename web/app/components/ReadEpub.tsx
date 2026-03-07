'use client'

import React, {useEffect, useRef, useState} from "react"
import ePub, {Book, NavItem, Rendition} from "epubjs"
import {Button, IconChevronLeft, IconChevronRight} from "@heroui/react"
import {useRouter} from "next/navigation"

interface EpubReaderProps {
    unzipRootURL: string
}

export const ReadEpub: React.FC<EpubReaderProps> = ({unzipRootURL}) => {
    const viewerRef = useRef<HTMLDivElement>(null)
    const renditionRef = useRef<Rendition | null>(null)
    const bookRef = useRef<Book | null>(null)

    const router = useRouter()

    const [toc, setToc] = useState<NavItem[]>([])
    const [isMounted, setIsMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!viewerRef.current || !unzipRootURL || !isMounted) return

        const root = unzipRootURL.replace("META-INF/container.xml", "")
        const book = ePub(root + '/')
        bookRef.current = book

        const rendition = book.renderTo(viewerRef.current, {
            width: "100%",
            height: "100%",
            flow: "scrolled",
            manager: "default",
            // Cho phép script chạy nếu epub có yêu cầu layout phức tạp
            allowScriptedContent: true,
        })

        // --- PHẦN OVERRIDE CSS ---
        rendition.themes.default({
            body: {
                // "font-family": "'Inter', 'Segoe UI', sans-serif !important",
                "font-size": "18px !important",
                // "line-height": "1.6 !important",
                // "color": "#333 !important",
                // "padding": "0 20px !important",
                // "background-color": "transparent !important"
            },
            "body, p, div, span, li, h1, h2, h3, h4, h5, h6": {
                // Cụm thần chú ép dùng font hệ thống mặc định, vô hiệu hoá font gốc của epub
                "font-family": 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important',
            },
            // Ghi đè cho các thẻ text cụ thể để tránh bị font gốc của epub làm xấu
            "p, div, li": {
                // "font-family": "'Inter', sans-serif !important",
                "font-size": "18px !important",
                "line-height": "1.6 !important", /* TĂNG KHOẢNG CÁCH DÒNG LÊN 1.8 */
            },
            "h1, h2, h3, h4, h5, h6": {
                "font-family": "'Inter', sans-serif !important",
                "font-weight": "700 !important",
                "margin-top": "1.5em !important",
                "margin-bottom": "0.5em !important",
                "text-align": "center !important",
            },
            "img": {
                "max-width": "100% !important",
                "height": "auto !important"
            }
        })

        renditionRef.current = rendition
        rendition.display()

        // Lấy mục lục và xử lý location như cũ...
        book.loaded.navigation.then((nav) => {
            console.log(nav)
            setToc(nav.toc)
        })

        return () => {
            bookRef.current?.destroy()
            bookRef.current = null
        }
    }, [unzipRootURL, isMounted])

    const goToLocation = (href: string) => {
        renditionRef.current?.display(href)
        setSidebarOpen(false)
    }

    const nextPage = () => renditionRef.current?.next()
    const prevPage = () => renditionRef.current?.prev()

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">

            {/* Sidebar overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
        fixed md:static z-30
        top-0 left-0 h-full
        w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm
        transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
            >
                <div className="flex items-center gap-2 p-4 border-b">
                    <Button onClick={() => router.back()} variant='outline'>
                        Quay lại
                    </Button>
                    <h2 className="text-lg font-bold">Mục lục</h2>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 text-sm space-y-2">
                    {toc.map((item, index) => (
                        <div key={index}>
                            <div
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => goToLocation(item.href)}
                            >
                                {item.label.trim()}
                            </div>

                            {!!item.subitems?.length && item.subitems?.length > 0 && (
                                <ul className="ml-4 mt-1 space-y-1 text-xs text-slate-500">
                                    {item.subitems.map((sub, i) => (
                                        <li
                                            key={i}
                                            className="cursor-pointer hover:text-blue-600"
                                            onClick={() => goToLocation(sub.href)}
                                        >
                                            {sub.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {toc.length === 0 && (
                        <p className="text-xs text-slate-400 italic">
                            Đang tải mục lục...
                        </p>
                    )}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col relative">

                {/* Top bar mobile */}
                <div className="md:hidden flex items-center gap-2 p-3 border-b bg-white">
                    <Button size="sm" onClick={() => router.back()}>
                        Quay lại
                    </Button>
                    <Button size="sm" variant='outline' onClick={() => setSidebarOpen(true)}>
                        Mục lục
                    </Button>

                </div>

                {/* Floating controls */}
                <div className="absolute top-4 right-4 md:right-8 z-10 flex gap-2">

                    <Button
                        isIconOnly
                        onClick={prevPage}
                    >
                        <IconChevronLeft/>
                    </Button>

                    <Button
                        isIconOnly
                        onClick={nextPage}
                    >
                        <IconChevronRight/>
                    </Button>

                </div>

                {/* Book content */}
                <main className="flex-1 overflow-y-auto">
                    <div ref={viewerRef} className="w-full h-full"/>
                </main>

            </div>
        </div>
    )
}