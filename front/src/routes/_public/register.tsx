import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {AuthService} from "../../services";
import {toast} from "react-toastify";
import styled from "styled-components";
import {ArrowLeft} from "lucide-react";

// Components re-used
import {Button} from "@components/ui/Button.tsx";
import {InputField as Input} from "@components/ui/Input.tsx";

export const Route = createFileRoute('/_public/register')({
    component: RouteComponent,
})

type FormRegister = {
    name: string;
    email: string;
    password: string;
}

function RouteComponent() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormRegister>();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormRegister) =>
            AuthService.registers(data.name, data.email, data.password),
        onSuccess: () => {
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate({ to: "/login" });
        },
        onError: (error) => {
            toast.error(error?.message || "Đăng ký thất bại");
        }
    });

    return (
        <PageContainer>
            <RegisterBox>
                {/* Quay lại trang chủ */}
                <BackButton to="/">
                    <ArrowLeft size={16} />
                    <span>Trang chủ</span>
                </BackButton>

                <FormContent onSubmit={handleSubmit((data) => mutate(data))}>
                    <Header>
                        <h1>Đăng ký</h1>
                        <p>Bắt đầu hành trình khám phá tri thức</p>
                    </Header>

                    <InputGroup>
                        <Input
                            label="Họ và tên"
                            placeholder="Nhập tên của bạn"
                            error={errors.name?.message}
                            {...register('name', { required: "Vui lòng nhập tên" })}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="email@example.com"
                            error={errors.email?.message}
                            {...register('email', {
                                required: "Vui lòng nhập email",
                                pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" }
                            })}
                        />

                        <Input
                            label="Mật khẩu"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password', {
                                required: "Vui lòng nhập mật khẩu",
                                minLength: { value: 6, message: "Mật khẩu tối thiểu 6 ký tự" }
                            })}
                        />
                    </InputGroup>

                    <Button
                        fullWidth
                        type="submit"
                        isLoading={isPending}
                        size="lg"
                    >
                        Tạo tài khoản
                    </Button>

                    <Footer>
                        <p>Đã có tài khoản? <TextLink to="/login">Đăng nhập</TextLink></p>
                    </Footer>
                </FormContent>
            </RegisterBox>
        </PageContainer>
    )
}

// --- Styled Components (Đồng bộ với Login) ---

const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
`;

const RegisterBox = styled.div`
    position: relative;
    width: 100%;
    max-width: 440px;
    padding: 4.5rem 2.5rem 3.5rem;
    background: white;
    border: 1px solid #e4e4e7;
    border-radius: 0; 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
`;

const BackButton = styled(Link)`
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #a1a1aa;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
        color: #18181b;
        transform: translateX(-2px);
    }
`;

const FormContent = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const Header = styled.div`
    text-align: center;
    h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #18181b;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        margin-bottom: 0.75rem;
    }
    p {
        color: #71717a;
        font-size: 0.875rem;
        margin: 0;
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const Footer = styled.div`
    text-align: center;
    font-size: 14px;
    color: #52525b;
`;

const TextLink = styled(Link)`
    color: #18181b;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s;

    &:hover {
        border-bottom-color: #18181b;
    }
`;