import {createFileRoute, Link, useRouter} from '@tanstack/react-router'
import {useForm} from "react-hook-form";
import {useState} from "react";
import {AuthService} from "../../services";
import {toast} from "react-toastify";
import styled from "styled-components";
import {Input} from "../../components/ui/Input.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {Button} from "../../components/ui/Button.tsx";

export const Route = createFileRoute('/_public/register')({
    component: RouteComponent,
})

type FormLogin = {
    name: string;
    email: string;
    password: string;
}

function RouteComponent() {

    const {register, handleSubmit} = useForm<FormLogin>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {navigate} = useRouter()

    const onSubmit = async (data: FormLogin) => {
        setIsSubmitting(true)
        try {
            const res = await AuthService.registers(data.name, data.email, data.password)
            if (res.success) {
                navigate({to: "/login"})
                toast.success('Successfully registered! Please login to continue your learning journey')
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error?.message)

            }
        } finally {
            setIsSubmitting(false)
        }
    }


    return <div>
        <RegisterForm onSubmit={handleSubmit(onSubmit)}>
            <h1>Join Kid learning</h1>
            <div>Create an account to start journey</div>
            <Input
                id='name'
                label="Your name"
                icon={<FontAwesomeIcon icon={faUser}/>}
                inputProps={{
                    type: 'text',
                    placeholder: 'Enter your username',
                    ...register('name')
                }}/>

            <Input
                id='email'
                label="Your email"
                icon={<FontAwesomeIcon icon={faEnvelope}/>}
                inputProps={{
                    type: 'email',
                    placeholder: 'Enter your email',
                    ...register('email')
                }}/>

            <Input
                id='password'
                label="Your password"
                icon={<FontAwesomeIcon icon={faLock}/>}
                inputProps={{
                    type: 'password',
                    placeholder: 'Enter your password',
                    ...register('password')
                }}/>

            <Button isFullWidth type="submit" disabled={isSubmitting}>Register</Button>
            <div>Already have an account? <StyledLink to="/login">Login</StyledLink></div>
        </RegisterForm>
    </div>
}

const RegisterForm = styled.form`
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