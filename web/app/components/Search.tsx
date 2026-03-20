'use client'

import {CloseIcon, InputGroup, Label, Switch} from "@heroui/react";
import {useRouter} from "next/navigation";
import {HistoryIcon, SearchIcon} from "lucide-react";
import {useEffect, useState} from "react";

type Props = {
    onClose(): void
}

export default function Search({onClose}: Props) {
    const router = useRouter()
    const [type, setType] = useState<'author' | 'book'>('book')
    const [history, setHistory] = useState<string[]>([])

    useEffect(() => {
        const h = localStorage.getItem('search_history')
        const history = h ? JSON.parse(h) : []
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(history)
    }, [])

    const onSearch = (term: string) => {
        if (term) {
            if (type === 'author') {
                router.push(`/books?author=${term}`);
            } else
                router.push(`/books?search=${term}`);

            // save history
            if (history.length > 5) {
                history.pop()
            }
            history.unshift(term)
            localStorage.setItem('search_history', JSON.stringify(history))
            onClose()
        }
    }

    return <div className='space-y-6 p-2'>
        <InputGroup fullWidth variant='primary'>
            <InputGroup.Input
                placeholder={type === 'book' ? 'Tên sách' : 'Tên tác giả'}
                type="search"
                autoFocus
                className='text-lg'
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        const searchTerm = e.currentTarget.value.trim();
                        onSearch(searchTerm);
                        e.currentTarget.value = '';
                        e.currentTarget.blur()
                    }
                }}
            />
            <InputGroup.Suffix>
                <SearchIcon/>
            </InputGroup.Suffix>
        </InputGroup>

        <Switch isSelected={type === 'author'} onChange={s => setType(s ? 'author' : 'book')}>
            <Switch.Control>
                <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
                <Label>Tìm kiếm bằng tác giả</Label>
            </Switch.Content>
        </Switch>

        <div className='flex flex-col gap-2'>
            {history.map((item, index) => (
                <div key={index} className='flex items-center gap-4 cursor-pointer' onClick={() => onSearch(item)}>
                    <HistoryIcon/>
                    <span>{item}</span>
                    <CloseIcon className='ml-auto' onClick={e => {
                        e.stopPropagation()
                        const newHistory = history.filter(h => h !== item)
                        setHistory(newHistory)
                        localStorage.setItem('search_history', JSON.stringify(newHistory))
                    }}/>
                </div>
            ))}
        </div>
    </div>
}