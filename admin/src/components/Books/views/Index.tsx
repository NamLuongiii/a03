import {DataTable} from "../../ui/Table.tsx";
import {useNavigate} from "@tanstack/react-router";
import {getBooksOptions} from "../../../api";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {columns} from "@components/Books/interface/columns.tsx";
import {useForm} from "react-hook-form";
import {CancelSearchCreateBtns} from "@components/ui/CancelSearchCreateBtns.tsx";

export default function BooksPage() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const {register, reset, handleSubmit, formState} = useForm<{ search: string }>()
    const onCreateBook = () => {
        navigate({to: '/book/new'});
    };

    const {data: response, isLoading} = useQuery(getBooksOptions({query: {page: page, size: 24, search}}));

    return (
        <div className="space-y-6">
            <h1 className='text-lg font-semibold'>Sách</h1>

            <form onSubmit={handleSubmit(({search}) => setSearch(search))}>
                <input
                    type="text"
                    placeholder="Tên sách"
                    className="input"
                    {...register('search')}
                />

                <CancelSearchCreateBtns
                    onCancel={() => {
                        reset()
                        setSearch('')
                    }}
                    onCreate={onCreateBook}
                    isValid={formState.isValid}
                    isLoading={isLoading}
                />
            </form>

            <DataTable
                columns={columns}
                paginationData={response?.data}
                isLoading={isLoading}
                setPage={setPage}
            />
        </div>
    );
}