export function getFullUrl(url?: string): string {
    return `${process.env.NEXT_PUBLIC_R2_URL}${url}`;
}