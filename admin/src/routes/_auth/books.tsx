import {createFileRoute} from '@tanstack/react-router'
import BooksPage from "../../components/Books.tsx";

export const Route = createFileRoute('/_auth/books')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <BooksPage />
  </div>
}
