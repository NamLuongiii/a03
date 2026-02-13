import {Input as Inp} from '@headlessui/react'
import styled from "styled-components";
import * as React from "react";

type Props = {
    id: string
    icon: React.ReactNode
    label: string
    inputProps: React.InputHTMLAttributes<HTMLInputElement>
}
export const Input = ({id, icon, label, inputProps}: Props) => {
    return <Field>
        <Label htmlFor={id}>
            {icon}
            <span>{label}</span></Label>
        <InputStyled id={id} {...inputProps} />
    </Field>
}

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5rem;
`

const Label = styled.label`
    display: flex;
    align-items: center;
    gap: .5rem;
`

const InputStyled = styled(Inp)`
    width: 100%;
    padding: .5rem;
    border: 1px solid #ccc;
    border-radius: .25rem;
`