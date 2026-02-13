import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_public/about')({
    component: about,
})

function about() {
    return <div>
        <a href="https://github.com/NamLuongiii">https://github.com/NamLuongiii</a>
    </div>
}