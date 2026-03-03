import styled from 'styled-components';
import type {ModelsBook} from "../api/data-contracts.ts";
import {DownloadDropdown} from "@components/DownloadDropdown.tsx";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const LeftSection = styled.div`
    flex-shrink: 0;
    width: 100%;
    max-width: 300px;

    @media (min-width: 768px) {
        max-width: 250px;
    }
`;

const Image = styled.img`
    width: 100%;
`;

const RightSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
`;

const Title = styled.h1`
    font-size: 1.6rem;
    font-weight: bold;
    color: #111827;
`;

const Description = styled.p`
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.6;
`;

const DetailText = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
`;

type Props = {
    book: ModelsBook
}

export const ItemDetail = ({book}: Props) => {

    return (
        <Container>
            <LeftSection>
                <Image src={book.cover?.md} alt=""/>
            </LeftSection>
            <RightSection>
                <Title>{book.name}</Title>
                <Description>
                    {book.description}
                </Description>
                <DetailText>
                    Tác giả: {book.author?.name}<br/>
                    {/*Nhà xuất bản: Example Press<br/>*/}
                    {/*Năm xuất bản: 2024<br/>*/}
                    {/*Số trang: 320*/}
                </DetailText>

                <DownloadDropdown book={book} />
            </RightSection>
        </Container>
    );
};
