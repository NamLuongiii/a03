import {createFileRoute} from '@tanstack/react-router'
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {AuthService} from "../../services";
import {Button} from "../../components/ui/Button.tsx";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import styled from "styled-components";

export const Route = createFileRoute('/_public/forgot-password')({
    component: RouteComponent,
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
enum Step {
    EMAIL,
    VERIFICATION,
    PASSWORD,
}

type FormEmail = {
    email: string;
}

type FormVerification = {
    otp: string;
}


type FormPassword = {
    password: string;
    confirmPassword: string;
}

const Container = styled.div`
    padding: 2rem;
    margin: 2rem auto;
    background-color: var(--surface-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-low);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: fit-content;

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`

function RouteComponent() {
    const [step, setStep] = useState<Step>(Step.EMAIL)
    const [email, setEmail] = useState<string>('')
    const [signJWT, setSignJWT] = useState<string>('')

    // STEP 1: Send OTP
    const {handleSubmit: handleSubmitSendOTP, register: registerSendOTP} = useForm<FormEmail>()

    const {mutateAsync: sendOTP, isPending: isPendingSendOTP} = useMutation({
        mutationKey: ['send-otp'],
        mutationFn: async (data: FormEmail) => AuthService.askResetPassword(data.email),
        onSuccess: (res) => {
            setStep(Step.VERIFICATION)
            setEmail(res.data)
        }
    })

    // STEP 2: Validate OTP
    const {handleSubmit: handleSubmitValidateOTP, register: registerValidateOTP} = useForm<FormVerification>()
    const {mutateAsync: verifyOTP, isPending: isPendingOTP} = useMutation({
        mutationKey: ['validation-OTP', email],
        mutationFn: (data: FormVerification) => AuthService.verifyOTP(email, data.otp),
        onSuccess: (res) => {
            setStep(Step.PASSWORD)
            setSignJWT(res.data)
        }
    })

    // STEP 3: Reset password
    const {handleSubmit: handleSubmitResetPassword, register: registerResetPassword} = useForm<FormPassword>()
    const {mutateAsync: resetPassword, isPending: isPendingResetPassword} = useMutation({
        mutationKey: ['reset-password', email, signJWT],
        mutationFn: (data: FormPassword) => AuthService.resetPassword(email, data.password, signJWT),
    })


    if (step === Step.EMAIL) return <Container>
        <h1>Forgot password</h1>
        <form onSubmit={handleSubmitSendOTP(data => sendOTP(data))}>
            <input type="email" placeholder="Enter your email" {...registerSendOTP('email')}/>
            <Button type='submit' isLoading={isPendingSendOTP}>Send verification code</Button>
        </form>
    </Container>

    if (step === Step.VERIFICATION) return <Container>
        <h1>Reset password</h1>
        <form onSubmit={handleSubmitValidateOTP(data => verifyOTP(data))}>
            <input type="text" placeholder='Endter your verification code' {...registerValidateOTP('otp')}/>
            <Button type='submit' isLoading={isPendingOTP}>Reset password</Button>
        </form>
    </Container>

    return <Container>
        <h1>Forgot password</h1>
        <form onSubmit={handleSubmitResetPassword(data => {
            if (data.password !== data.confirmPassword) {
                toast.error('Passwords do not match')
            } else
                resetPassword(data).then()
        })}>
            <div>{email}</div>
            <input type="text" placeholder='New password' {...registerResetPassword('password')}/>
            <input type="text" placeholder='Confirm password' {...registerResetPassword('confirmPassword')}/>
            <Button type='submit' isLoading={isPendingResetPassword}>Reset password</Button>
        </form>
    </Container>
}
