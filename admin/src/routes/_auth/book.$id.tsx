import {createFileRoute, useParams} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {getBooksByIdOptions} from "@/api";
import {UpdateBook} from "@components/Books/views/UpdateBook.tsx";

export const Route = createFileRoute('/_auth/book/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const {id} = useParams({from: '/_auth/book/$id'})

    const {data} = useQuery(getBooksByIdOptions({path: {id: id}}))


    const b = data?.data
    if (!b) return <></>
    return <UpdateBook id={id} book={b}/>
}
