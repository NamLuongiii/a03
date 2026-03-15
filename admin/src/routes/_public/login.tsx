import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {ArrowRight, LockKeyhole, User} from "lucide-react";
import {Field, Input, Label} from "@headlessui/react";
import {Button} from "@components/ui/Button.tsx";
import {cn} from "@/ultis/cn.ts";
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
            const me = resMe.data?.data as ModelsAccount
            setMe(me)
            navigation({to: '/'}).then()
        }).catch(err => {
            toast.danger(err.message)
        })
    })

    return (
        <div className="min-h-screen bg-main-bg flex items-center justify-center p-6 font-sans">
            {/* Container chính bento-style */}
            <div className="w-full max-w-105">
                <div className="admin-card p-10! shadow-xl border-slate-200/60">

                    {/* Logo hoặc Tiêu đề */}
                    <div className="mb-10 text-center">
                        <div
                            className="inline-flex items-center justify-center w-12 h-12 bg-main-text text-white rounded-2xl mb-4 shadow-lg">
                            <LockKeyhole size={24}/>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
                        <p className="text-muted-text text-sm mt-2">Vui lòng đăng nhập để tiếp tục quản trị hệ
                            thống.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">

                        {/* Username Field */}
                        <Field className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-text ml-1">
                                Tài khoản
                            </Label>
                            <div className="relative group">
                                <User
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                                    size={18}/>
                                <Input
                                    type="text"
                                    placeholder="admin_username"
                                    required
                                    className={cn(
                                        "block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm",
                                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                    )}
                                    {...register("email")}
                                />
                            </div>
                        </Field>

                        {/* Password Field */}
                        <Field className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-text ml-1">
                                Mật khẩu
                            </Label>
                            <div className="relative group">
                                <LockKeyhole
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                                    size={18}/>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className={cn(
                                        "block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm",
                                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                    )}
                                    {...register("password")}
                                />
                            </div>
                        </Field>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4! text-base! shadow-lg shadow-blue-500/10"
                            isLoading={isPending}
                        >
                            Đăng nhập hệ thống
                            <ArrowRight size={18} className="ml-2"/>
                        </Button>

                    </form>

                    {/* Footer Footer tóm lược */}
                    <footer className="mt-10 text-center">
                        <p className="text-[11px] text-muted-text uppercase tracking-widest leading-loose">
                            Protected by Bento Security <br/>
                            © 2026 Admin Panel
                        </p>
                    </footer>
                </div>

                {/* Decor mờ phía sau (Option) */}
                <div className="mt-8 text-center opacity-30 select-none">
                    <span className="text-xs font-mono">SYSTEM STATUS: OPTIMIZED</span>
                </div>
            </div>
        </div>
    );
}
