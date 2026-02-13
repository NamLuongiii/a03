import {useAuth} from "../auth.tsx";
import {AuthModal} from "@components/AuthModal.tsx";
import Avatar from "boring-avatars";

export function HeaderUser() {
    const {isAuthenticated} = useAuth();


    if (!isAuthenticated) return <AuthModal/>

    return (
        <>
            <Avatar/>
        </>
    )
}