import {createFileRoute} from '@tanstack/react-router'
import LearnMath from './LearnMath.tsx'

export const Route = createFileRoute('/_auth/math/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <LearnMath/>
}
