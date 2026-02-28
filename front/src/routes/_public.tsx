import {createFileRoute, Outlet, useLocation} from '@tanstack/react-router'
import {Header} from "@components";

export const Route = createFileRoute('/_public')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation();
    const shouldHideHeader = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';
    // const navigation = useNavigate();
    // const goHome = () => navigation({to: '/'})


    return <div>
        {!shouldHideHeader ? <Header/> : <></>}
        <div className={'content'}>
            <Outlet/>
        </div>
    </div>
}
