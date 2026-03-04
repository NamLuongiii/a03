'use client'

import {useForm} from 'react-hook-form'
import {Button, Card, Input, Label, Spinner, TextField, toast} from '@heroui/react'
import {useMutation} from "@tanstack/react-query";
import {postAuthSignup} from "@/app/api";

type SignupForm = {
    name: string
    email: string
    password: string
}

export default function SignupPage() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<SignupForm>()

    const {mutateAsync, isPending} = useMutation({
        mutationKey: ['signup'],
        mutationFn: (data: SignupForm) => postAuthSignup({body: data}),
    })

    const onSubmit = async (data: SignupForm) => {
        mutateAsync(data).then(res => {
            console.log(res)
            // redirect to the login
        }).catch(err => {
            toast.danger(err.message)
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md p-8 space-y-6">
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-semibold">Create account</h1>
                    <p className="text-sm text-default-500">
                        Start your reading journey
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <TextField
                        isInvalid={!!errors.name}
                        type="email"

                    >
                        <Label>Email</Label>
                        <Input
                            {...register('email', {
                                required: 'Email is required',
                            })} />
                    </TextField>

                    <TextField
                        isInvalid={!!errors.name}
                        type="Tên"

                    >
                        <Label>Tên</Label>
                        <Input
                            {...register('name', {
                                required: 'Tên là bắt buộc',
                            })} />
                    </TextField>

                    <TextField
                        isInvalid={!!errors.name}
                        type="password"

                    >
                        <Label>Mật khẩu</Label>
                        <Input
                            {...register('password', {
                                required: 'Mật khẩu là bắt buộc',
                            })} />
                    </TextField>


                    <Button
                        type="submit"
                    >
                        {isPending && <Spinner/>}
                        Sign Up
                    </Button>
                </form>
            </Card>
        </div>
    )
}