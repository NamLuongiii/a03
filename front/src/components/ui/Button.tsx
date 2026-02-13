import styled from "styled-components";
import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isFullWidth?: boolean
    isLoading?: boolean
}

const ButtonStyled = styled.button`
    background: var(--gradient-logo);
    color: var(--btn-primary-text);
    padding: .5rem 1rem;
    border: 4px solid var(--border-color);
`

export const Button = ({isFullWidth, isLoading, ...props}: Props) => {
    return <ButtonStyled
        {...props}
        style={{
            ...(isFullWidth && {width: '100%'})
        }}
        disabled={props.disabled || isLoading}>
        {isLoading && <FontAwesomeIcon icon={faCircleNotch}/>}
        {props.children}</ButtonStyled>
}
