'use client'

import {Button, Dropdown} from "@heroui/react";
import {ModelsDigitalBook} from "@/app/api";
import prettyBytes from "pretty-bytes";
import {saveAs} from 'file-saver'
import {getFullUrl} from "@/app/helpers";
import {DownloadIcon} from "lucide-react";

type Props = {
    db: ModelsDigitalBook[]
}

export function DownloadBook({db}: Props) {
    return (
        <Dropdown>
            <Button isIconOnly={true} aria-label="Menu" variant='tertiary'>
                <DownloadIcon/>
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                    {db.map((item) => (
                        <Dropdown.Item key={item.id}
                                       id={item.id}
                                       onClick={() => {
                                           if (!item.url) return;
                                           saveAs(getFullUrl(item.url), item.name)
                                       }}
                        >{item.file_type}
                            <small className='ml-auto'>{prettyBytes(item.file_size || 0)}</small></Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}