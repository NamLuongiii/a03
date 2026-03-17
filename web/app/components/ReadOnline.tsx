'use client'

import {ModelsBook} from "@/app/api";
import {Button, ButtonGroup, CloseIcon, IconChevronLeft, IconChevronRight, Modal, Toolbar} from "@heroui/react";
import {useRouter} from "next/navigation";
import {MenuIcon, Rocket} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {EpubEngine} from "@/app/epubEngine";
import BookNavigation from "@/app/components/BookNavigation";
import {NavItem} from "epubjs";

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
            bookEngine.render(renderRef.current).then(() => {
                return bookEngine.goToStoredLocation()
            }).catch(console.error)
        })

        return () => bookEngine.destroy()
    }, [book.unzip_root_url, mounted, book.id]);

    const goHome = () => {
        router.push(`/books/${book.id}`)
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

    if (!mounted) return null

    return <div className='h-screen flex flex-col'>
        <div ref={renderRef} className='w-full h-100vh relative flex-1 mx-auto overflow-hidden'>
        </div>

        <Toolbar
            aria-label="Toolbar"
            orientation='vertical'
            className='fixed bottom-6 right-6'
        >
            <ButtonGroup variant='tertiary'>
                <Button
                    aria-label='open-menu'
                    isIconOnly
                    onClick={() => setOpen(true)}>
                    <MenuIcon/>
                </Button>
                <Button
                    aria-label='next-chapter'
                    isIconOnly
                    onClick={nextChapter}
                >
                    <ButtonGroup.Separator/>
                    <IconChevronRight/>
                </Button>
                <Button
                    aria-label='previous-chapter'
                    isIconOnly
                    onClick={prevChapter}
                >
                    <ButtonGroup.Separator/>
                    <IconChevronLeft/>
                </Button>
            </ButtonGroup>

            <ButtonGroup variant='tertiary'>
                <Button
                    aria-label='go-home'
                    isIconOnly
                    onClick={goHome}
                >
                    <CloseIcon/>
                </Button>
            </ButtonGroup>
        </Toolbar>

        <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Rocket className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading>Mục lục</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <BookNavigation nav={nav} jumpTo={jumpToChapter}/>
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
    </div>
}
