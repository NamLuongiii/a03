'use client'

import {useEffect, useRef, useState} from "react"
import ePub, {NavItem, Rendition} from "epubjs"
import {Button} from "@heroui/react";

type Props = {
    unzipRootURL: string
}

export default function ReadEpub({unzipRootURL}: Props) {
    const viewerRef = useRef<HTMLDivElement>(null)

    const [rendition, setRendition] = useState<Rendition | null>(null)
    const [toc, setToc] = useState<NavItem[]>([])
    const [chapter, setChapter] = useState("Loading...")

    useEffect(() => {
        if (!viewerRef.current) return

        const root = unzipRootURL.replace("META-INF/container.xml", "")
        const book = ePub(root)

        const r = book.renderTo(viewerRef.current, {
            width: "100%",
            height: "100%",
            flow: "scrolled-doc",
            manager: "continuous",
        })

        setRendition(r)

        r.display()

        book.loaded.navigation.then(({toc}) => setToc(toc))

        r.on("relocated", (loc: any) => {
            const href = loc.start.href
            book.loaded.navigation.then(({toc}) => {
                const c = toc.find(i => href.includes(i.href))
                if (c) setChapter(c.label.trim())
            })
        })

        return () => book.destroy()
    }, [unzipRootURL])

    return (
        <div className="flex h-[80vh]">

            {/* TOC */}
            <div className="w-60 border-r overflow-auto">
                {toc.map((item, i) => (
                    <div
                        key={i}
                        className="p-2 text-sm cursor-pointer hover:bg-gray-100"
                        onClick={() => rendition?.display(item.href)}
                    >
                        {item.label}
                    </div>
                ))}
            </div>

            {/* Reader */}
            <div className="flex-1 flex flex-col">

                <div className="p-2 border-b text-sm">{chapter}</div>

                <div ref={viewerRef} className="flex-1 overflow-auto"/>

                <div className="flex gap-2 p-2 border-t">
                    <Button onClick={() => rendition?.prev()}>Prev</Button>
                    <Button onClick={() => rendition?.next()}>Next</Button>
                </div>

            </div>
        </div>
    )
}