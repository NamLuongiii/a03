import {Dialog, DialogPanel} from "@headlessui/react";
import * as React from "react";
import styled from "styled-components";

type Props = {
    open: boolean,
    setIsOpen: (isOpen: boolean) => void,
    children?: React.ReactNode
    className?: string
}

const DialogContainer = styled.div`
    display: flex;
    position: fixed;
    inset: 0;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

const DialogPanelWithStyle = styled(DialogPanel)`
    width: fit-content;
    background-color: var(--bg-color);
    padding: 2rem;
    box-shadow: var(--shadow-high)
`

export default function Modal({open, setIsOpen, children, className}: Props) {
    return <Dialog open={open} onClose={() => setIsOpen(false)} style={{zIndex: 10000}}>
        <DialogContainer>
            <DialogPanelWithStyle className={className}>
                {children}
            </DialogPanelWithStyle>
        </DialogContainer>
    </Dialog>
}