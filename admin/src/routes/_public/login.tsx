import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button} from "@components/ui/Button.tsx";
import {useForm} from "react-hook-form";
import {useAuth} from "../../Auth.tsx";
import {useMutation} from "@tanstack/react-query";
import {Auth, type ModelsAccount, postAuthLoginMutation} from "@/api";
import {Form, InputGroup, toast} from "@heroui/react";

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
            <section className="flex flex-col items-center justify-center h-screen text-center gap-4">
                <header>
                    <h1>Đăng nhập Admin</h1>
                    <p>Hệ thống quản trị docluon.com</p>
                </header>

                <Form onSubmit={onSubmit} className='inline-flex flex-col gap-4 w-auto mx-auto'>
                    <InputGroup>
                        <InputGroup.Input
                            type="email"
                            required
                            placeholder="Email"
                            {...register("email")}
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Input
                            type="password"
                            required
                            placeholder="Password"
                            {...register("password")}
                        />
                    </InputGroup>

                    <Button type="submit" isLoading={isPending}>
                        Đăng nhập
                    </Button>
                </Form>

                <footer>
                    <small>© 2026 Admin Portal</small>
                </footer>
            </section>
        </main>
    );
}