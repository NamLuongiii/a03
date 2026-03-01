import {createFileRoute} from '@tanstack/react-router'
import {Header} from "../../components/Header.tsx";

export const Route = createFileRoute('/_auth/book/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Header title={'Book Detail'} showBack={true} />
  </div>
}
