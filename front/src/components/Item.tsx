import styled from 'styled-components';
import {useNavigate} from "@tanstack/react-router";
import type {ModelsBook} from "../api/data-contracts.ts";

const Card = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    transition: box-shadow 0.3s;

    &:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
`;

const Name = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
`;

interface ItemProps {
    book: ModelsBook
}

export const Item = ({book}: ItemProps) => {
    const navigate = useNavigate()
    const handleClick = (id: number) => {
        navigate({to: `/book/${id}`}).then()
    }
    return (
        <Card onClick={() => handleClick(1)}>
            {/*Cover */}
            <img src={book.cover?.xs} alt="cover" style={{width: '100%'}}/>

            <Name>{book.name}</Name>
        </Card>
    );
};
