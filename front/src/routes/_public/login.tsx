import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {MUTATION_KEYS} from "../../constants";
import {AuthService} from "../../services";
import {toast} from "react-toastify";
import {z} from "zod";
import styled from "styled-components";
import {Button} from "../../components/ui/Button.tsx";
import {useAuth} from "../../auth.tsx";

export const Route = createFileRoute('/_public/login')({
    component: RouteComponent,
    validateSearch: z.object({
        redirect: z.string().optional(),
    }),
})

type FormLogin = {
    email: string;
    password: string;
}

function RouteComponent() {
    const {register, handleSubmit} = useForm<FormLogin>({})
    const {login} = useAuth()
    const navigate = useNavigate()

    // query login
    const {mutateAsync, isPending} = useMutation({
        mutationKey: [MUTATION_KEYS.LOGIN],
        mutationFn: async (data: FormLogin) => {
            // perform login logic here
            const result = await AuthService.login(data.email, data.password);
            return result.data
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return <div>
        <LoginForm className="auth" onSubmit={handleSubmit((data: FormLogin) => {
            console.log(data)
            mutateAsync(data).then(login).then(() => {
                navigate({to: '/'}).then()
            })
        })}>
            <h1>Welcome Back!</h1>
            <div>Sign in to continue your learning journey</div>

            <input id='email'
                   // icon={<span/>}
                   // label="Email"
                   placeholder="Enter your email"
                   type="email"
                   {...register('email')}
            />
            <input id='password'
                   // icon={<span/>}
                   // label="Password"
                   placeholder="Enter your password"
                   type="password"
                   {...register('password')}
            />
            <Button type="submit" disabled={isPending} fullWidth>Login</Button>

            <div>
                Don't have an account? <StyledLink to="/register">Register</StyledLink>
            </div>
            <StyledLink to="/forgot-password">Forgot password</StyledLink>
        </LoginForm>

    </div>
}

const LoginForm = styled.form`
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
    text-align: center;
`

const StyledLink = styled(Link)`
    background: var(--gradient-logo);
    background-clip: text;
    color: transparent;
`