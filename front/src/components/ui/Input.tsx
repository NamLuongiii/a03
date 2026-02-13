import {Input as Inp} from '@headlessui/react'
import styled from "styled-components";
import * as React from "react";

type Props = {
    id?: string
    icon?: React.ReactNode
    label?: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled' | 'outlined'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    disabled?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<Props> = ({
                                           id,
                                           icon,
                                           label,
                                           error,
                                           helperText,
                                           variant = 'default' as 'default' | 'filled' | 'outlined',
                                           size = 'md' as 'sm' | 'md' | 'lg',
                                           fullWidth = false,
                                           disabled = false,
                                           ...inputProps
                                       }) => {
    return (
        <Field $fullWidth={fullWidth}>
            {label && (
                <Label htmlFor={id} $disabled={disabled}>
                    {icon && <IconWrapper>{icon}</IconWrapper>}
                    <span>{label}</span>
                </Label>
            )}
            <InputWrapper>
                {icon && !label && <IconWrapper $absolute>{icon}</IconWrapper>}
                <InputStyled
                    id={id}
                    $variant={variant}
                    $size={size}
                    $hasError={!!error}
                    $hasIcon={!!icon && !label}
                    disabled={disabled}
                    {...inputProps}
                />
            </InputWrapper>
            {(error || helperText) && (
                <HelperText $isError={!!error}>
                    {error || helperText}
                </HelperText>
            )}
        </Field>
    )
}

const Field = styled.div<{ $fullWidth: boolean }>`
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: ${props => props.$fullWidth ? '100%' : 'auto'};
`

const Label = styled.label<{ $disabled: boolean }>`
    display: flex;
    align-items: center;
    gap: .5rem;
    font-size: .875rem;
    font-weight: 500;
    color: ${props => props.$disabled ? '#9ca3af' : '#374151'};
    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
`

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`

const IconWrapper = styled.span<{ $absolute?: boolean }>`
    ${props => props.$absolute && `
        position: absolute;
        left: 0.75rem;
        pointer-events: none;
    `}
    display: flex;
    align-items: center;
    color: #6b7280;
`

const InputStyled = styled(Inp)<{
    $variant: 'default' | 'filled' | 'outlined'
    $size: 'sm' | 'md' | 'lg'
    $hasError: boolean
    $hasIcon: boolean
}>`
    width: 100%;
    font-family: inherit;
    outline: none;
    transition: all 0.2s;

    ${props => props.$hasIcon && `padding-left: 2.5rem;`}
        /* Size variants */
    ${props => {
        switch (props.$size) {
            case 'sm':
                return `
                    padding: 0.375rem 0.75rem;
                    font-size: 0.875rem;
                    border-radius: 0.25rem;
                `;
            case 'lg':
                return `
                    padding: 0.75rem 1rem;
                    font-size: 1.125rem;
                    border-radius: 0.5rem;
                `;
            default:
                return `
                    padding: 0.5rem 0.75rem;
                    font-size: 1rem;
                    border-radius: 0.375rem;
                `;
        }
    }}
        /* Style variants */
    ${props => {
        const borderColor = props.$hasError ? '#ef4444' : '#d1d5db';
        const focusBorderColor = props.$hasError ? '#dc2626' : '#3b82f6';

        switch (props.$variant) {
            case 'filled':
                return `
                    background-color: #f3f4f6;
                    border: 2px solid transparent;
                    color: #1f2937;

                    &:hover:not(:disabled) {
                        background-color: #e5e7eb;
                    }

                    &:focus {
                        background-color: #fff;
                        border-color: ${focusBorderColor};
                    }
                `;
            case 'outlined':
                return `
                    background-color: transparent;
                    border: 2px solid ${borderColor};
                    color: #1f2937;

                    &:hover:not(:disabled) {
                        border-color: #9ca3af;
                    }

                    &:focus {
                        border-color: ${focusBorderColor};
                        box-shadow: 0 0 0 3px ${props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
                    }
                `;
            default:
                return `
                    background-color: #fff;
                    border: 1px solid ${borderColor};
                    color: #1f2937;

                    &:hover:not(:disabled) {
                        border-color: #9ca3af;
                    }

                    &:focus {
                        border-color: ${focusBorderColor};
                        box-shadow: 0 0 0 3px ${props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
                    }
                `;
        }
    }}
    &:disabled {
        background-color: #f9fafb;
        color: #9ca3af;
        cursor: not-allowed;
        opacity: 0.6;
    }

    &::placeholder {
        color: #9ca3af;
    }
`

const HelperText = styled.span<{ $isError: boolean }>`
    font-size: 0.75rem;
    color: ${props => props.$isError ? '#ef4444' : '#6b7280'};
    margin-top: -0.25rem;
`