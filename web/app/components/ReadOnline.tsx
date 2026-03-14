'use client'

import {ModelsBook} from "@/app/api";
import {Button, CloseIcon, IconChevronRight, Modal} from "@heroui/react";
import {useRouter} from "next/navigation";
import {Rocket, SquareMenu} from "lucide-react";
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

        if (!book.unzip_root_url || !renderRef.current || !mounted) return;

        const bookEngine = new EpubEngine(book.unzip_root_url)
        bookEngineRef.current = bookEngine

        bookEngine.init().then(() => {
            console.log('bookEngine init')
            bookEngine.getNavigation().then(nav => {
                setNav(nav)
            })

            if (!renderRef.current) return
            bookEngine.render(renderRef.current).catch(alert)
        })

        return () => bookEngine.destroy()
    }, [book.unzip_root_url, mounted]);

    const goHome = () => {
        router.push(`/books/${book.id}`)
    }

    const nextChapter = () => {
        if (!bookEngineRef.current) return
        bookEngineRef.current.next()
    }

    const jumpToChapter = (item: NavItem) => {
        if (!bookEngineRef.current) return
        setOpen(false)
        bookEngineRef.current.jumpToChapter(item).catch(alert)
    }

    if (!mounted) return null

    return <div className='h-screen flex flex-col'>
        <div ref={renderRef} className='w-full flex-1 mx-auto overflow-scroll'>
        </div>

        <footer className='flex justify-end items-center gap-2 p-2 bg-blue-500 text-white'>
            <Button isIconOnly onClick={goHome} variant='secondary'><CloseIcon/></Button>
            <Button
                isIconOnly
                variant='secondary'
                onClick={() => setOpen(true)}><SquareMenu/></Button>
            <Button variant='primary' className='max-w-4/6' onClick={nextChapter}>
                <span className='truncate'>{book.name}</span><IconChevronRight/>
            </Button>
        </footer>

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
