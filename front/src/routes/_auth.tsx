import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'
import {Header} from "../components/Header.tsx";

export const Route = createFileRoute('/_auth')({
    beforeLoad: ({context, location}) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!context.auth.me) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
        } else if (!context.auth.profile && location.pathname !== '/profile') {
            throw redirect({
                to: '/profile',
                search: {
                    redirect: location.href
                }
            })
        }
    },
    component: AuthLayout,
})

function AuthLayout() {
    return (
        <div>
            <Header/>
            <Outlet/>
        </div>
    )
}