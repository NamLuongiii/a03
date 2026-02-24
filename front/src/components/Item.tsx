import styled from 'styled-components';
import {useNavigate} from "@tanstack/react-router";
import type {ModelsBook} from "../api/data-contracts.ts";

const Card = styled.div`
    transition: box-shadow 0.3s;

    &:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
`;

const Name = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    lineclamp: 2;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

interface ItemProps {
    book: ModelsBook
}

export const Item = ({book}: ItemProps) => {
    const navigate = useNavigate()
    const handleClick = (id: string) => {
        navigate({to: `/book/${id}`}).then()
    }
    return (
        <Card onClick={() => handleClick(book.id as string)}>
            {/*Cover */}
            <img src={book.cover?.xs} alt="cover" style={{width: '100%'}}/>

            <Name>{book.name}</Name>
        </Card>
    );
};
