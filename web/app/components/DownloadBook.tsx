'use client'

import {Button, Dropdown} from "@heroui/react";
import {ModelsDigitalBook} from "@/app/api";

type Props = {
    db: ModelsDigitalBook[]
}

export function DownloadBook({db}: Props) {
    return (
        <Dropdown>
            <Button aria-label="Menu" variant="primary">
                Tải về
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                    {db.map((item) => (
                        <Dropdown.Item key={item.id} id={item.id} textValue={item.name}>{item.name}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}