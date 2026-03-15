import ReactDOM from 'react-dom/client'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import './index.css'

// Import the generated route tree
import {routeTree} from './routeTree.gen'
import {ToastContainer} from "react-toastify";
import {AuthProvider, useAuth} from "./Auth.tsx";
import {Toaster} from "sonner";
import {AlertDialogProvider} from "@/providers/AlertProvider.tsx";
import {Toast} from '@heroui/react';

// Create a new router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
        auth: undefined!, // This will be set after we wrap the app in an AuthProvider
    },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// eslint-disable-next-line react-refresh/only-export-components
function InnerApp() {
    const auth = useAuth()
    return <RouterProvider router={router} context={{auth}}/>
}

// Set tanstack query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    }
})

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <div>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AlertDialogProvider>
                        <InnerApp/>
                    </AlertDialogProvider>
                </AuthProvider>
                <ToastContainer/>
            </QueryClientProvider>
            <Toast.Provider/>
            <Toaster/>
        </div>,
    )
}