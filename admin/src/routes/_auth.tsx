import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
    beforeLoad: ({context}) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!context.auth?.isAuthenticated) {
            throw redirect({
                to: '/login',
            })
        }
    },
    component: AuthLayout,
})

function AuthLayout() {
    return (
        <div>
            <Outlet/>
        </div>
    )
}