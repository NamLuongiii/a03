import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {AuthService} from "../../services";
import {toast} from "react-toastify";
import {z} from "zod";
import styled from "styled-components";
import {Button} from "../../components/ui/Button.tsx";
import {useAuth} from "../../auth.tsx";
import {InputField} from "@components/ui/Input.tsx";

export const Route = createFileRoute('/_public/login')({
    component: RouteComponent,
    validateSearch: z.object({
        redirect: z.string().optional(),
    }),
})

type FormLogin = z.infer<typeof loginSchema>;
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

function RouteComponent() {
    const { register, handleSubmit } = useForm<FormLogin>();
    const { login } = useAuth();
    const navigate = useNavigate();
    const { redirect } = Route.useSearch();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormLogin) => AuthService.login(data.email, data.password),
        onSuccess: (res) => {
            login(res.data);
            navigate({ to: redirect || '/' });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });

    return (
        <PageContainer>
            <LoginForm onSubmit={handleSubmit((data) => mutate(data))}>
                <Header>
                    <h1>Đăng nhập</h1>
                    <p>Tiếp tục hành trình đọc sách của bạn</p>
                </Header>

                <InputGroup>
                    <InputField
                        type="email"
                        placeholder="Email"
                        {...register('email')}
                        required
                    />
                    <InputField
                        type="password"
                        placeholder="Mật khẩu"
                        {...register('password')}
                        required
                    />
                </InputGroup>

                <Button type="submit" isLoading={isPending} fullWidth>
                    Xác nhận
                </Button>

                <Footer>
                    <p>Chưa có tài khoản? <TextLink to="/register">Đăng ký</TextLink></p>
                    <TextLink to="/forgot-password" style={{ fontSize: '13px', opacity: 0.7 }}>
                        Quên mật khẩu?
                    </TextLink>
                </Footer>
            </LoginForm>
        </PageContainer>
    )
}

// --- Styled Components ---

const PageContainer = styled.div`
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
`;

const LoginForm = styled.form`
    width: 100%;
    max-width: 400px;
    padding: 3rem 2.5rem;
    background: white;
    border: 1px solid #e4e4e7;
    /* Loại bỏ hoàn toàn border-radius để theo style modern sharp */
    border-radius: 0; 
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 1rem;

    h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #18181b;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.5rem;
    }

    p {
        color: #71717a;
        font-size: 0.875rem;
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const Footer = styled.div`
    margin-top: 0.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-size: 14px;
    color: #52525b;
`;

const TextLink = styled(Link)`
    color: #18181b;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border 0.2s;

    &:hover {
        border-bottom: 1px solid #18181b;
    }
`;