import styled, {css, keyframes} from "styled-components";
import * as React from "react";
import {Loader2} from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const ButtonStyled = styled.button<{
    $variant: string;
    $size: string;
    $fullWidth: boolean;
    $isLoading: boolean;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    border-radius: 0; /* Giữ style vuông vức modern */
    transition: all 0.2s ease;
    cursor: pointer;
    font-family: inherit;
    outline: none;
    border: 1px solid transparent;
    position: relative;
    white-space: nowrap;
    user-select: none;

    ${props => props.$fullWidth && css`width: 100%;`}

        /* Sizes - Tinh chỉnh padding cho thanh thoát */
    ${props => {
        switch (props.$size) {
            case 'sm': return css`padding: 6px 12px; font-size: 13px;`;
            case 'lg': return css`padding: 12px 24px; font-size: 15px;`;
            default: return css`padding: 9px 18px; font-size: 14px;`;
        }
    }}

        /* Variants - Màu sắc nhẹ nhàng (Soft Minimalist) */
    ${props => {
        switch (props.$variant) {
            case 'primary': return css`
                background: #27272a; /* Zinc 800 - Nhẹ hơn đen */
                color: #ffffff;
                &:hover:not(:disabled) { background: #3f3f46; }
            `;
            case 'secondary': return css`
                background: #f4f4f5; /* Zinc 100 */
                color: #27272a;
                &:hover:not(:disabled) { background: #e4e4e7; }
            `;
            case 'outline': return css`
                background: transparent;
                border-color: #e4e4e7;
                color: #52525b;
                &:hover:not(:disabled) {
                    border-color: #a1a1aa;
                    color: #18181b;
                    background: #fafafa;
                }
            `;
            case 'ghost': return css`
                background: transparent;
                color: #71717a;
                &:hover:not(:disabled) {
                    background: #f4f4f5;
                    color: #18181b;
                }
            `;
            case 'danger': return css`
                background: #fef2f2;
                color: #ef4444;
                &:hover:not(:disabled) { background: #fee2e2; }
            `;
            default: return '';
        }
    }}

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    /* Hiệu ứng nhấn nhẹ */
    &:active:not(:disabled) {
        background-color: rgba(0, 0, 0, 0.05);
        ${props => props.$variant === 'primary' && css`background-color: #18181b;`}
    }
`;

const LoadingWrapper = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LoadingIcon = styled(Loader2)`
    animation: ${spin} 0.8s linear infinite;
    color: currentColor;
    opacity: 0.7;
`;

const Content = styled.span<{ $hidden: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: inherit;
    visibility: ${props => props.$hidden ? 'hidden' : 'visible'};
`;

export const Button = React.forwardRef<HTMLButtonElement, Props>(({
                                                                      variant = 'primary',
                                                                      size = 'md',
                                                                      fullWidth = false,
                                                                      isLoading = false,
                                                                      leftIcon,
                                                                      rightIcon,
                                                                      children,
                                                                      disabled,
                                                                      ...props
                                                                  }, ref) => {
    return (
        <ButtonStyled
            {...props}
            ref={ref}
            $variant={variant}
            $size={size}
            $fullWidth={fullWidth}
            $isLoading={isLoading}
            disabled={disabled || isLoading}
        >
            {isLoading && (
                <LoadingWrapper>
                    <LoadingIcon size={18} />
                </LoadingWrapper>
            )}

            <Content $hidden={isLoading}>
                {leftIcon && <span>{leftIcon}</span>}
                {children}
                {rightIcon && <span>{rightIcon}</span>}
            </Content>
        </ButtonStyled>
    );
});

Button.displayName = 'Button';