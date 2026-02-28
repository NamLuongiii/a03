import {createFileRoute, Link} from '@tanstack/react-router'
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import styled from "styled-components";
import {ArrowLeft} from "lucide-react";

// Components re-used
import {AuthService} from "../../services";
import {Button} from "@components/ui/Button.tsx";
import {InputField as Input} from "@components/ui/Input.tsx";

export const Route = createFileRoute('/_public/forgot-password')({
    component: RouteComponent,
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
enum Step {
    EMAIL = 0,
    VERIFICATION = 1,
    PASSWORD = 2,
}

type FormEmail = { email: string; }
type FormVerification = { otp: string; }
type FormPassword = { password: string; confirmPassword: string; }

function RouteComponent() {
    const [step, setStep] = useState<Step>(Step.EMAIL)
    const [email, setEmail] = useState<string>('')
    const [signJWT, setSignJWT] = useState<string>('')

    // STEP 1: Ask Reset
    const { register: regEmail, handleSubmit: handleEmail, formState: { errors: errEmail } } = useForm<FormEmail>()
    const { mutate: sendOTP, isPending: isPendingEmail } = useMutation({
        mutationFn: (data: FormEmail) => AuthService.askResetPassword(data.email),
        onSuccess: (res) => {
            setEmail(res.data)
            setStep(Step.VERIFICATION)
            toast.info("Mã xác thực đã được gửi tới email của bạn");
        },
        onError: (err) => toast.error(err.message)
    })

    // STEP 2: Verify OTP
    const { register: regOTP, handleSubmit: handleOTP, formState: { errors: errOTP } } = useForm<FormVerification>()
    const { mutate: verifyOTP, isPending: isPendingOTP } = useMutation({
        mutationFn: (data: FormVerification) => AuthService.verifyOTP(email, data.otp),
        onSuccess: (res) => {
            setSignJWT(res.data)
            setStep(Step.PASSWORD)
        },
        onError: (err) => toast.error(err.message)
    })

    // STEP 3: Reset Password
    const { register: regPass, handleSubmit: handlePass, formState: { errors: errPass } } = useForm<FormPassword>()
    const { mutate: resetPassword, isPending: isPendingPass } = useMutation({
        mutationFn: (data: FormPassword) => AuthService.resetPassword(email, data.password, signJWT),
        onSuccess: () => {
            toast.success("Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.");
            // Logic điều hướng về login ở đây
        },
        onError: (err) => toast.error(err.message)
    })

    const renderStep = () => {
        switch (step) {
            case Step.EMAIL:
                return (
                    <FormBox onSubmit={handleEmail(data => sendOTP(data))}>
                        <Header>
                            <h1>Quên mật khẩu</h1>
                            <p>Nhập email để nhận mã xác thực</p>
                        </Header>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="your@email.com"
                            error={errEmail.email?.message}
                            {...regEmail('email', { required: "Vui lòng nhập email" })}
                        />
                        <Button type='submit' isLoading={isPendingEmail} fullWidth>Gửi mã xác nhận</Button>
                    </FormBox>
                )
            case Step.VERIFICATION:
                return (
                    <FormBox onSubmit={handleOTP(data => verifyOTP(data))}>
                        <Header>
                            <h1>Xác thực</h1>
                            <p>Nhập mã OTP vừa được gửi tới <strong>{email}</strong></p>
                        </Header>
                        <Input
                            label="Mã OTP"
                            placeholder="Nhập 6 chữ số"
                            error={errOTP.otp?.message}
                            {...regOTP('otp', { required: "Vui lòng nhập mã xác thực" })}
                        />
                        <Button type='submit' isLoading={isPendingOTP} fullWidth>Xác nhận mã</Button>
                    </FormBox>
                )
            case Step.PASSWORD:
                return (
                    <FormBox onSubmit={handlePass(data => {
                        if (data.password !== data.confirmPassword) {
                            return toast.error('Mật khẩu không trùng khớp')
                        }
                        resetPassword(data)
                    })}>
                        <Header>
                            <h1>Mật khẩu mới</h1>
                            <p>Thiết lập mật khẩu mới cho tài khoản</p>
                        </Header>
                        <Input
                            label="Mật khẩu mới"
                            type="password"
                            placeholder="••••••••"
                            error={errPass.password?.message}
                            {...regPass('password', { required: "Vui lòng nhập mật khẩu mới" })}
                        />
                        <Input
                            label="Xác nhận mật khẩu"
                            type="password"
                            placeholder="••••••••"
                            error={errPass.confirmPassword?.message}
                            {...regPass('confirmPassword', { required: "Vui lòng xác nhận mật khẩu" })}
                        />
                        <Button type='submit' isLoading={isPendingPass} fullWidth>Cập nhật mật khẩu</Button>
                    </FormBox>
                )
        }
    }

    return (
        <PageContainer>
            <ContentCard>
                <BackButton to="/login">
                    <ArrowLeft size={16} />
                    <span>Quay lại</span>
                </BackButton>
                {renderStep()}
            </ContentCard>
        </PageContainer>
    )
}

// --- Styled Components (Modern Industrial) ---

const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color);
`;

const ContentCard = styled.div`
    position: relative;
    width: 100%;
    max-width: 420px;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 0;
    padding: 4.5rem 2.5rem 3.5rem;
    box-shadow: var(--shadow-sm);
`;

const BackButton = styled(Link)`
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
        color: var(--text-main);
    }
`;

const FormBox = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
`;

const Header = styled.div`
    text-align: center;
    h1 {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
    }
    p {
        margin: 0;
        line-height: 1.4;
    }
    strong {
        color: var(--text-main);
    }
`;