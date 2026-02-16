import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const SearchValue = styled.span`
  color: #374151;
`;

const RemoveIcon = styled.button`
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;

  &:hover {
    color: #ef4444;
  }
`;

export const SearchBox = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    'React hooks',
    'TypeScript tutorial',
    'Styled components',
    'Headless UI',
  ]);

  const removeHistoryItem = (index: number) => {
    setSearchHistory(searchHistory.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <Input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder="Search..."
      />
      {isFocused && searchHistory.length > 0 && (
        <Dropdown>
          {searchHistory.map((item, index) => (
            <HistoryItem key={index}>
              <SearchValue>{item}</SearchValue>
              <RemoveIcon onClick={() => removeHistoryItem(index)}>✕</RemoveIcon>
            </HistoryItem>
          ))}
        </Dropdown>
      )}
    </Container>
  );
};
