import styled from 'styled-components';
import type {ModelsBook} from "../api/data-contracts.ts";
import {Button} from "@components/ui/Button.tsx";
import {saveAs} from 'file-saver';
import prettyBytes from "pretty-bytes";
import {useState} from "react";

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
    font-size: 1.875rem;
    font-weight: bold;
    color: #111827;

    @media (min-width: 768px) {
        font-size: 2.25rem;
    }
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
    const [showFiles, setShowFiles] = useState(false);

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
                    {/*Author: <Link to={`/author/${book.author_id}`}>John Doe</Link><br/>*/}
                    {/*Publisher: Example Press<br/>*/}
                    {/*Year: 2024<br/>*/}
                    {/*Pages: 320*/}
                </DetailText>

                <Button type="button" onClick={() => setShowFiles(!showFiles)}>Tải về</Button>
                {showFiles && (
                    <div>
                        {book.digital_books?.map(file =>
                            <Button
                                type="button"
                                onClick={() => {
                                    if (file.url) {
                                        saveAs(file.url, file.name)
                                    }
                                }}
                                key={file.id}>{file.file_type} ({prettyBytes(file.file_size || 0)})</Button>)}
                    </div>
                )}
            </RightSection>
        </Container>
    );
};
