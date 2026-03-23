import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Field, Input, Label} from "@headlessui/react";
import {Button} from "@components/ui/Button.tsx";
import {useForm} from "react-hook-form";
import {useAuth} from "../../Auth.tsx";
import {useMutation} from "@tanstack/react-query";
import {Auth, type ModelsAccount, postAuthLoginMutation} from "@/api";
import {toast} from "@heroui/react";

export const Route = createFileRoute('/_public/login')({
    component: RouteComponent,
})

type TForm = {
    email: string;
    password: string;
}

function RouteComponent() {
    const {setMe} = useAuth()
    const {register, handleSubmit} = useForm<TForm>()
    const navigation = useNavigate()
    const {mutateAsync, isPending} = useMutation(postAuthLoginMutation())

    const onSubmit = handleSubmit((data: TForm) => {
        mutateAsync({body: data}).then(async res => {
            const token = res.data as string
            localStorage.setItem('token', token)
            const resMe = await Auth.getAuthMe({headers: {Authorization: token}})
            setMe(resMe.data?.data as ModelsAccount)
            navigation({to: '/'})
        }).catch(err => toast.danger(err.message))
    })

    return (
        <main>
            <section>
                <header>
                    <h1>Đăng nhập Admin</h1>
                    <p>Hệ thống quản trị docluon.com</p>
                </header>

                <form onSubmit={onSubmit}>
                    <Field>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            required
                            {...register("email")}
                        />
                    </Field>

                    <Field>
                        <Label>Mật khẩu</Label>
                        <Input
                            type="password"
                            required
                            {...register("password")}
                        />
                    </Field>

                    <Button type="submit" isLoading={isPending}>
                        Đăng nhập
                    </Button>
                </form>

                <footer>
                    <small>© 2026 Admin Portal</small>
                </footer>
            </section>
        </main>
    );
}