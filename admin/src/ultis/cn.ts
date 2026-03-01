import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Hàm hỗ trợ gộp class Tailwind thông minh
 * 1. clsx: Cho phép viết logic điều kiện { 'bg-red-500': hasError }
 * 2. twMerge: Tự động loại bỏ các class Tailwind bị trùng lặp/xung đột
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}