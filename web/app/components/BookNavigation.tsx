'use client'

import {NavItem} from "epubjs";
import {Label, ListBox} from "@heroui/react";

type Props = {
    nav: NavItem[]
    jumpTo(item: NavItem): void
}
export default function BookNavigation({nav, jumpTo}: Props) {

    return <div>
        {nav.map((item, index) => (
            <ListBox key={index} aria-label="Menu" selectionMode="single">
                <ListBox.Item onClick={() => jumpTo(item)}>
                    <Label>{item.label}</Label>
                </ListBox.Item>
                {/*{item.subitems && <BookNavigation nav={item.subitems} jumpTo={jumpTo}/>}*/}
                {item.subitems?.map((subitem, subindex) => (
                    <ListBox.Item
                        key={`sub-${subindex}`}
                        // className='ml-8'
                        onClick={() => jumpTo(subitem)}>
                        <Label className='text-ellipsis'>{subitem.label}</Label>
                    </ListBox.Item>
                ))}
            </ListBox>
        ))}
    </div>
}