import styled from "styled-components";
import {GridLoader} from "react-spinners";

const LoadingStyle = styled.div`
    margin: 2rem;
    text-align: center;
`

export const Loading = () => <LoadingStyle>
    <GridLoader color={'var(--color-primary)'}/>
</LoadingStyle>;