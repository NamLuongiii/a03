import styled from 'styled-components';
import {useNavigate} from "@tanstack/react-router";
import type {ModelsBook} from "../api/data-contracts.ts";

// --- Styled Components ---

const Card = styled.div`
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    transform: translateY(-4px);
    
    img {
      border-color: #18181b; /* Đậm viền khi hover */
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
      color: #18181b;
      text-decoration: underline;
      text-underline-offset: 4px;
    }
  }
`;

const CoverWrapper = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3; /* Tỉ lệ vàng của bìa sách */
  background-color: #f4f4f5;
  overflow: hidden;
  border: 1px solid #e4e4e7;
  transition: all 0.3s ease;
`;

const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${Card}:hover & {
    transform: scale(1.05); /* Zoom nhẹ ảnh bìa */
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Name = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #27272a;
  line-height: 1.4;
  margin: 0;
  
  /* Line clamp 2 dòng */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Author = styled.span`
  font-size: 12px;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

// --- Component ---

interface ItemProps {
    book: ModelsBook
}

export const Item = ({ book }: ItemProps) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate({ to: `/book/${book.id}` });
    };

    return (
        <Card onClick={handleNavigate}>
            <CoverWrapper>
                <CoverImg
                    src={book.cover?.sm || book.cover?.xs}
                    alt={book.name || "Book Cover"}
                    loading="lazy"
                />
            </CoverWrapper>

            <Info>
                {/* Giả định ModelsBook có field author, nếu không hãy xóa dòng này */}
                <Author>{book.author?.name || "Tác giả"}</Author>
                <Name title={book.name}>{book.name}</Name>
            </Info>
        </Card>
    );
};