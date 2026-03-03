import {createFileRoute, useParams} from '@tanstack/react-router'
import {Header} from "@components/Header.tsx";
import {useQuery} from "@tanstack/react-query";
import {getBooksByIdOptions} from "@/api";
import {UpdateBook} from "@components/UpdateBook.tsx";

export const Route = createFileRoute('/_auth/book/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const {id} = useParams({ from: '/_auth/book/$id'})

  const {data} = useQuery(getBooksByIdOptions({ path: {id: id}}))


  const b = data?.data
  if (!b) return <></>
  return <div>
    <Header title={b.name || ''} showBack={true} />
    <UpdateBook id={id} book={b} />
  </div>
}
