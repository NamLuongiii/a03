import {createRootRoute, Outlet, useNavigate} from '@tanstack/react-router'
import {ErrorBoundary, type FallbackProps} from "react-error-boundary";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

const FallbackStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
`

function Fallback({error, resetErrorBoundary}: FallbackProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({to: '/'}).then(() => {
            resetErrorBoundary();
        });
    }
    return (
        <FallbackStyled role="alert">
            <FontAwesomeIcon icon={faHome} size='xl' onClick={handleClick}/>
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button type="button" onClick={resetErrorBoundary}>Retry</button>
        </FallbackStyled>
    );
}

const RootLayout = () => (
    <ErrorBoundary
        FallbackComponent={Fallback}
        onReset={(details) => {
            // Reset the state of your app so the error doesn't happen again
            console.log(details)
        }}
    >
        <Outlet/>
    </ErrorBoundary>
)

export const Route = createRootRoute({component: RootLayout})