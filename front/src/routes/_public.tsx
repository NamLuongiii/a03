import {createFileRoute, Outlet} from '@tanstack/react-router'
import {Header} from "../components/Header.tsx"; // far -> regular

export const Route = createFileRoute('/_public')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>
        <Header/>
        <div className={'content'}>
            <Outlet/>
        </div>
    </div>
}
