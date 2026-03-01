import {createFileRoute} from '@tanstack/react-router'
import {Header} from "../../components/Header.tsx";

export const Route = createFileRoute('/_auth/book/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Header title="Thêm sách mới" showBack={true} />
  </div>
}
