import styled from 'styled-components';
import {useNavigate} from "@tanstack/react-router";

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

const Subname = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
`;

interface ItemProps {
  name: string;
  subname: string;
}

export const Item = ({ name, subname }: ItemProps) => {
    const navigate = useNavigate()
    const handleClick = (id: number) => {
        navigate({to: `/book/${id}`}).then()
    }
  return (
    <Card onClick={() => handleClick(1)}>
      <Name>{name}</Name>
      <Subname>{subname}</Subname>
    </Card>
  );
};
