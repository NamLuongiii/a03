import {createRootRoute, Outlet} from '@tanstack/react-router'
import {ErrorBoundary, type FallbackProps} from "react-error-boundary";
import styled from "styled-components";

const FallbackStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
`

function Fallback({error, resetErrorBoundary}: FallbackProps) {

    return (
        <FallbackStyled role="alert">
            <p>Something went wrong:</p>
            <pre>{(error as Error).message}</pre>
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