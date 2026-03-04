'use client'
import {useQuery} from "@tanstack/react-query";
import {getCookie} from "cookies-next";
import {getAuthMe} from "@/app/api";

export const useMe = () => {
    const token = getCookie('auth_token');

    const {data: user} = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await getAuthMe();
            return res.data?.data; // Đảm bảo trả về đúng cấu trúc dữ liệu
        },
        // CẤU HÌNH QUAN TRỌNG:
        enabled: !!token,           // Chỉ gọi API khi đã có token
        staleTime: 1000 * 60 * 60, // Dữ liệu được coi là "tươi" trong 1 tiếng (không refetch liên tục)
        gcTime: 1000 * 60 * 60 * 24, // Giữ trong bộ nhớ đệm 24 tiếng
    });

    return user;
};