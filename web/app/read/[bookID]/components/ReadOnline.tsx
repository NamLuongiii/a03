'use client'

import {ModelsBook} from "@/app/api";
import {Button, CloseIcon, Modal, Tabs} from "@heroui/react";
import {useRouter} from "next/navigation";
import {ALargeSmall, FullscreenIcon, MenuIcon} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {EpubEngine} from "@/app/read/[bookID]/epub";
import BookNavigation from "@/app/read/[bookID]/components/BookNavigation";
import {NavItem} from "epubjs";
import {type Font, fonts, Theme, themes} from "@/app/read/[bookID]/types/type";
import {getFullUrl} from "@/app/helpers";

type Props = {
    book: ModelsBook
}


export default function ReadOnline({book}: Props) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [nav, setNav] = useState<NavItem[]>([])
    const bookEngineRef = useRef<EpubEngine>(null)
    // const [chapterUrl, setChapterUrl] = useState<string | null>(null)
    const renderRef = useRef<HTMLDivElement>(null)
    const [openSettings, setOpenSettings] = useState<boolean>(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)

        if (
            !book.unzip_root_url ||
            !renderRef.current ||
            !mounted ||
            !book.id
        ) return;

        const bookEngine = new EpubEngine(book.id, book.unzip_root_url)
        bookEngineRef.current = bookEngine

        bookEngine.init().then(() => {
            console.log('bookEngine init')
            bookEngine.getNavigation().then(nav => {
                setNav(nav)
            })

            if (!renderRef.current) return
            bookEngine.render(renderRef.current)
        })

        return () => bookEngine.destroy()
    }, [book.unzip_root_url, mounted, book.id]);

    const goHome = () => {
        router.back()
    }

    const nextChapter = () => {
        if (!bookEngineRef.current) return
        bookEngineRef.current.next()
    }

    const prevChapter = () => {
        if (!bookEngineRef.current) return
        bookEngineRef.current.previous()
    }

    const jumpToChapter = (item: NavItem) => {
        if (!bookEngineRef.current) return
        setOpen(false)
        bookEngineRef.current.jumpToChapter(item).catch(alert)
    }

    const toggleFullScreen = () => {
        // Kiểm tra xem hiện tại có đang trong chế độ FullScreen không
        if (!document.fullscreenElement) {
            // Nếu không: Yêu cầu mở FullScreen
            // Thường ta sẽ để cả trang hoặc chỉ element chứa nội dung sách (ví dụ: id="reader")
            const element = document.documentElement; // Toàn bộ trang web

            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                if (element.webkitRequestFullscreen) { /* Safari */
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    element.webkitRequestFullscreen();
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    if (element.msRequestFullscreen) { /* IE11 */
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        element.msRequestFullscreen();
                    }
                }
            }
        } else {
            // Nếu đang mở: Yêu cầu thoát
            if (document.exitFullscreen) {
                document.exitFullscreen();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
            } else if (document.webkitExitFullscreen) { /* Safari */
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                document.webkitExitFullscreen();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
            } else if (document.msExitFullscreen) { /* IE11 */
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                document.msExitFullscreen();
            }
        }
    };

    const clickTheme = (theme: Theme) => {
        if (!bookEngineRef.current) return
        bookEngineRef.current.setTheme(theme)
    }

    const clickFont = (font: Font) => {
        if (!bookEngineRef.current) return
        bookEngineRef.current.setFont(font)
    }

    const clickReset = () => {
        if (!bookEngineRef.current) return
        bookEngineRef.current.resetTheme()
        setOpenSettings(false)
    }

    if (!mounted) return null

    return <div className='h-screen flex flex-col'>
        <div className='flex items-center justify-between gap-4 border-b px-4 py-1 z-20'>
            <Button isIconOnly onClick={goHome} size='sm' variant='ghost'>
                <CloseIcon/>
            </Button>
            <div className='flex-1 text-ellipsis line-clamp-1 text-center text-xs italic '>{book.name}</div>

            <div>
                <Button isIconOnly size='sm' variant='ghost' onClick={toggleFullScreen}>
                    <FullscreenIcon/>
                </Button>
                <Button isIconOnly={true} size='sm' variant='ghost' onClick={() => setOpenSettings(true)}>
                    <ALargeSmall/>
                </Button>
                <Button isIconOnly onClick={() => setOpen(true)} size='sm' variant='ghost'>
                    <MenuIcon/>
                </Button>
            </div>
        </div>

        <div ref={renderRef} className='w-full h-100vh max-w-250 relative flex-1 mx-auto overflow-hidden'>
        </div>

        <button className='fixed left-0 h-screen bg-transparent cursor-pointer w-16 md:w-31 lg:w-60 z-10'
                onClick={prevChapter}/>
        <button className='fixed right-0 h-screen bg-transparent cursor-pointer w-16 md:w-31 lg:w-60 z-10'
                onClick={nextChapter}/>

        <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Heading>{book.name}</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <Tabs className="w-full max-w-md">
                                <Tabs.ListContainer>
                                    <Tabs.List aria-label="Options">
                                        <Tabs.Tab id="overview">
                                            Mục lục
                                            <Tabs.Indicator/>
                                        </Tabs.Tab>
                                        <Tabs.Tab id="analytics">
                                            Tổng quan
                                            <Tabs.Indicator/>
                                        </Tabs.Tab>
                                    </Tabs.List>
                                </Tabs.ListContainer>
                                <Tabs.Panel className="pt-4" id="overview">
                                    <BookNavigation nav={nav} jumpTo={jumpToChapter}/>
                                </Tabs.Panel>
                                <Tabs.Panel className="pt-4 flex flex-col items-center gap-4" id="analytics">
                                    {book.cover?.md && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={getFullUrl(book.cover?.md)} alt='cover' width={200}/>
                                    )}

                                    <p>{book.description}</p>

                                    <p>{book.author?.name}</p>
                                    <p>{book.category?.name}</p>
                                </Tabs.Panel>
                            </Tabs>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="w-full" slot="close">
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>

        <Modal isOpen={openSettings} onOpenChange={setOpenSettings}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <Modal.Heading>Cài đặt hiển thị</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='my-8 space-y-4'>
                                <div className='space-y-2'>
                                    <div className='text-lg font-semibold'>Chế độ</div>
                                    <div className='grid grid-cols-3 gap-4'>
                                        {themes.map(theme => (<div
                                            key={theme.code}
                                            className='border flex items-center justify-center'
                                            style={{
                                                ...theme.value,
                                                height: 48,
                                            }}
                                            onClick={() => clickTheme(theme)}
                                        >
                                            {theme.name}
                                        </div>))}
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <div className='text-lg font-semibold'>Kích thước chữ</div>
                                    <div className='grid grid-cols-5 gap-4'>
                                        {fonts.map(font => (
                                            <Button
                                                key={font.value}
                                                style={{fontSize: font.value}}
                                                onClick={() => clickFont(font)}
                                                variant='outline'
                                            >
                                                Aa
                                            </Button>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type='button' className="w-full" onClick={clickReset}>
                                Đặt lại
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    </div>
}
