import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useForm} from "react-hook-form";
import {useAuth} from "../../Auth.tsx";
import {useMutation} from "@tanstack/react-query";
import {Auth, type ModelsAccount, postAuthLoginMutation} from "@/api";
import {Form, toast} from "@heroui/react";

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
                <h1>Đăng nhập</h1>

                <Form onSubmit={onSubmit} className='inline-flex flex-col gap-4 w-auto mx-auto'>
                    <div className="input-floating w-96">
                        <input type="text" placeholder="Email" className="input" id="email" {...register('email')}/>
                        <label className="input-floating-label" htmlFor="email">Email</label>
                    </div>

                    <div className="input-floating w-96">
                        <input type="password" placeholder="Mật khẩu" className="input"
                               id="password" {...register('password')}/>
                        <label className="input-floating-label" htmlFor="password">Mật khẩu</label>
                    </div>

                    <button type='submit' className='btn btn-primary'>
                        {isPending && <span className="loading loading-spinner loading-sm"></span>}
                        Đăng nhập
                    </button>
                </Form>

                <footer>
                    <small>© 2026 Admin Portal</small>
                </footer>
            </section>
        </main>
    );
}