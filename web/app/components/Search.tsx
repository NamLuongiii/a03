'use client'

import {InputGroup} from "@heroui/react";
import {useRouter} from "next/navigation";
import {SearchIcon} from "lucide-react";


export default function Search() {
    const router = useRouter()

    return <div>
        <InputGroup fullWidth={true} variant='secondary'>
            <InputGroup.Input
                placeholder="Tìm kiếm sách"
                type="search"
                className='text-lg'
                autoFocus
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        const searchTerm = e.currentTarget.value;
                        if (searchTerm) {
                            router.push(`/books?search=${searchTerm}`);
                        }
                        e.currentTarget.value = '';
                        e.currentTarget.blur()
                    }
                }}
            />
            <InputGroup.Suffix>
                <SearchIcon/>
            </InputGroup.Suffix>
        </InputGroup>

    </div>
}