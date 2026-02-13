import {Popover as _Popover, PopoverButton, PopoverPanel} from '@headlessui/react'
import * as React from "react";
import styled from "styled-components";


type Props = {
    trigger: React.ReactNode,
    children: React.ReactNode,
    className?: string,
}

const PopoverPanelWithStyle = styled(PopoverPanel)`
    width: fit-content;
    background-color: var(--bg-color);
    padding: 1rem;
    box-shadow: var(--shadow-high);
    border-radius: 1rem;
`

export default function Popover({trigger, children, className}: Props) {
    return (
        <_Popover className="relative">
            <PopoverButton as={React.Fragment}>
                {trigger}
            </PopoverButton>
            <PopoverPanelWithStyle anchor={{
                gap: '1.5rem',
                to: 'top'
            }} className={className}>
                {children}
            </PopoverPanelWithStyle>
        </_Popover>
    )
}