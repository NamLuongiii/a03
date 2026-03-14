'use client'

import {Input} from "@heroui/react";
import {useRouter} from "next/navigation";

type Props = {
    onClose: () => void
}

export default function Search({onClose}: Props) {
    const router = useRouter()

    return <div>
        <Input
            fullWidth
            placeholder="Tìm kiếm sách"
            type="search"
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    const searchTerm = e.currentTarget.value;
                    if (searchTerm) {
                        router.push(`/books?search=${searchTerm}`);
                    }
                    e.currentTarget.value = '';
                    e.currentTarget.blur()
                    onClose()
                }
            }}
        />
    </div>
}