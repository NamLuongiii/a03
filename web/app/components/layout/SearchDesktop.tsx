import {InputGroup, Separator} from "@heroui/react";
import {HistoryIcon, SearchIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {getBooks, ModelsBook} from "@/app/api";
import {getFullUrl} from "@/app/helpers";
import {useDebounce} from "use-debounce";

export default function SearchDesktop() {
    const [history, setHistory] = useState<string[]>([]);
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const h = localStorage.getItem('search_history')
        const history = h ? JSON.parse(h) : []
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(history)
    }, [])

    const handleHistorySearch = (term: string) => {
        router.push(`/books?search=${term}`);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.trim();
        setSearchTerm(term);
    }


    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!searchTerm) return;
            saveHistory(searchTerm);
            router.push(`/books?search=${searchTerm}`);
        }
    }

    const handleSearchClick = () => {
        if (!searchTerm) return;
        saveHistory(searchTerm);
        router.push(`/books?search=${searchTerm}`);
    }

    const saveHistory = (term: string) => {
        if (history.length > 5) {
            history.pop()
        }
        history.unshift(term)
        localStorage.setItem('search_history', JSON.stringify(history))
    }

    const [debouncedSearch] = useDebounce(searchTerm, 500)

    const {data} = useQuery({
        queryKey: ['search-books', debouncedSearch],
        queryFn: () => getBooks({query: {search: debouncedSearch, size: 4, page: 1}}),
        enabled: debouncedSearch.length > 1,
    })

    const searchResults = (data?.data?.data?.items || []) as ModelsBook[];

    return (
        <div className="relative group w-fit mx-auto">
            <InputGroup>
                <InputGroup.Input
                    type="search"
                    size={40}
                    className='text-lg'
                    placeholder="Tìm kiếm"
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                />
                <InputGroup.Suffix onClick={handleSearchClick}><SearchIcon size={18}/></InputGroup.Suffix>
            </InputGroup>

            {/* Dropdown tối giản: Chỉ hiện khi focus-within */}
            <div
                className="absolute top-full translate-y-1 w-full bg-white border shadow-md hidden group-focus-within:block z-10 p-4 space-y-4">
                {searchResults.length > 0 && (
                    <>
                        <h3>Sách</h3>
                        <ul className="space-y-2">
                            {searchResults.map((book) => (
                                <li key={book.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(`/books/${book.id}`);
                                    }}>
                                    {book.cover?.md && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={getFullUrl(book.cover?.md)} alt={book.name} width={40} height={64}/>
                                    )}
                                    {book.name}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <Separator/>
                <h3>Lịch sử</h3>
                <ul className="space-y-2">
                    {history.map((h, i) => <li
                        key={i}
                        className="flex items-center gap-2 cursor-pointer"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleHistorySearch(h);
                        }}>
                        <HistoryIcon/>
                        {h}
                    </li>)}
                </ul>
            </div>
        </div>
    );
}