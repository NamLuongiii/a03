'use client'

import {useForm} from 'react-hook-form'
import {Button, Card, Input, Spinner, toast} from '@heroui/react'
import Link from "next/link";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {getAuthMe, ModelsAccount, postAuthLogin} from "@/app/api";
import {setCookie} from "cookies-next";
import {useRouter} from 'next/navigation'; // <--- Import ở đây

type LoginForm = {
    email: string
    password: string
}

export default function LoginPage() {
    const queryClient = useQueryClient(); // <--- 1. Lấy queryClient để quản lý cache

    const router = useRouter()
    const {
        register,
        handleSubmit,
    } = useForm<LoginForm>()

    const {mutateAsync, isPending} = useMutation({
        mutationKey: ['login'],
        mutationFn: (data: LoginForm) => postAuthLogin({body: data})
    })

    const onSubmit = async (data: LoginForm) => {
        mutateAsync(data).then(res => {
            const token = res.data?.data
            // save to cookies
            if (token) {
                // Lưu token vào cookie
                setCookie('auth_token', token, {
                    maxAge: 60 * 60 * 24 * 70, // Hết hạn sau 70 ngày (tính bằng giây)
                    path: '/',                // Có hiệu lực cho toàn bộ domain
                    // secure: true,          // Chỉ gửi qua HTTPS (bật khi lên production)
                    sameSite: 'lax',
                });

                getAuthMe().then(res => {
                    const me = res.data?.data as ModelsAccount
                    // 3. CẬP NHẬT USER VÀO GLOBAL CACHE (setQueryData)
                    // 'me' phải trùng với queryKey bạn dùng ở layout/navbar
                    queryClient.setQueryData(['me'], me);

                    toast.success("Đăng nhập thành công!");

                    // Chuyển hướng hoặc làm mới trang để cập nhật Navbar/Auth state
                    router.push('/');
                    router.refresh();
                })
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card
                className="w-full max-w-md p-8 space-y-6"
            >
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-semibold">Đọc Luôn ^^</h1>
                    <p className="text-sm text-default-500">
                        Đăng nhập để tiếp tục đọc
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Input
                        type="email"
                        {...register('email', {
                            required: 'Trường email là bắt buộc',
                        })}
                        placeholder="Email"
                    />

                    <Input
                        type="password"
                        {...register('password', {
                            required: 'Trường mật khẩu là bắt buộc',
                        })}
                        placeholder="Mật khẩu"
                    />

                    <Button
                        type="submit"
                        className="mt-2"
                        fullWidth
                    >
                        {isPending && <Spinner/>}
                        Đăng nhập
                    </Button>

                    {/*<div className="text-center text-sm text-default-500">*/}
                    {/*    <Link href="/forgot-password" className="hover:underline">*/}
                    {/*        Quên mật khẩu?*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                    <div className="text-center text-sm text-default-500">
                        <Link href="/signup" className="hover:underline">Chưa có tài khoản? Đăng ký
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    )
}