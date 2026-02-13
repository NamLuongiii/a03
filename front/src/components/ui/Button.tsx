import styled, { css, keyframes } from "styled-components";
import * as React from "react";
import { Loader2 } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const ButtonStyled = styled.button<{
    $variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    $size: 'sm' | 'md' | 'lg'
    $fullWidth: boolean
    $isLoading: boolean
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    border-radius: 0.375rem;
    transition: all 0.2s;
    cursor: pointer;
    font-family: inherit;
    outline: none;
    border: none;
    position: relative;
    white-space: nowrap;

    ${props => props.$fullWidth && css`
        width: 100%;
    `}
        /* Size variants */
    ${props => {
        switch (props.$size) {
            case 'sm':
                return css`
                    padding: 0.375rem 0.75rem;
                    font-size: 0.875rem;
                    border-radius: 0.25rem;
                `;
            case 'lg':
                return css`
                    padding: 0.75rem 1.5rem;
                    font-size: 1.125rem;
                    border-radius: 0.5rem;
                `;
            default:
                return css`
                    padding: 0.5rem 1rem;
                    font-size: 1rem;
                `;
        }
    }}
        /* Style variants */
    ${props => {
        switch (props.$variant) {
            case 'primary':
                return css`
                    background: var(--gradient-logo, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
                    color: var(--btn-primary-text, #ffffff);

                    &:hover:not(:disabled) {
                        opacity: 0.9;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    }

                    &:active:not(:disabled) {
                        transform: translateY(0);
                    }
                `;

            case 'secondary':
                return css`
                    background: #f3f4f6;
                    color: #374151;

                    &:hover:not(:disabled) {
                        background: #e5e7eb;
                    }

                    &:active:not(:disabled) {
                        background: #d1d5db;
                    }
                `;

            case 'outline':
                return css`
                    background: transparent;
                    color: var(--gradient-logo, #667eea);
                    border: 2px solid var(--border-color, #667eea);

                    &:hover:not(:disabled) {
                        background: rgba(102, 126, 234, 0.1);
                    }

                    &:active:not(:disabled) {
                        background: rgba(102, 126, 234, 0.2);
                    }
                `;

            case 'ghost':
                return css`
                    background: transparent;
                    color: #374151;

                    &:hover:not(:disabled) {
                        background: #f3f4f6;
                    }

                    &:active:not(:disabled) {
                        background: #e5e7eb;
                    }
                `;

            case 'danger':
                return css`
                    background: #ef4444;
                    color: #ffffff;

                    &:hover:not(:disabled) {
                        background: #dc2626;
                        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                    }

                    &:active:not(:disabled) {
                        background: #b91c1c;
                    }
                `;
        }
    }}
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    ${props => props.$isLoading && css`
        cursor: wait;
    `}
`

const LoadingIcon = styled(Loader2)`
    animation: ${spin} 1s linear infinite;
`

const IconWrapper = styled.span`
    display: flex;
    align-items: center;
`

export const Button: React.FC<Props> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
}) => {
    return (
        <ButtonStyled
            {...props}
            $variant={variant}
            $size={size}
            $fullWidth={fullWidth}
            $isLoading={isLoading}
            disabled={disabled || isLoading}
        >
            {isLoading && (
                <IconWrapper>
                    <LoadingIcon size={16} />
                </IconWrapper>
            )}
            {!isLoading && leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
            {children}
            {!isLoading && rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
        </ButtonStyled>
    )
}
