import {createFileRoute} from '@tanstack/react-router'
import Profiles from "./Profiles.tsx";

export const Route = createFileRoute('/_auth/profile/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Profiles/>
}
