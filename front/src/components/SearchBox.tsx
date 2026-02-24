import {useRef, useState} from 'react';
import styled from 'styled-components';
import {Search} from 'lucide-react';
import {useNavigate} from "@tanstack/react-router"; // Hoặc dùng icon SVG/FontAwesome tùy bạn

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 1rem; /* Chừa khoảng trống bên phải cho icon */
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  padding: 0.25rem;

  &:hover { color: #3b82f6; }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.4rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover { background: #f3f4f6; }
  
  button { 
    border: none; background: none; color: #ccc; 
    &:hover { color: #ef4444; }
  }
`;

export const SearchBox = () => {
  const [val, setVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState(['React hooks', 'TypeScript', 'Styled components']);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    const s = val.trim();
      navigate({
        to: "/books",
        search: {
          search: s,
          page: 1,
          size: 12
        },
      }).then(() => {
        setVal("")
        setIsFocused(false);
        inputRef.current?.blur()
      })
  };

  return (
      <Container>
        <InputWrapper>
          <Input
              ref={inputRef}
              placeholder="Tìm kiếm sách..."
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchButton onClick={handleSearch}>
            <Search size={18} />
          </SearchButton>
        </InputWrapper>

        {isFocused && history.length > 0 && (
            <Dropdown>
              {history.map((item, i) => (
                  <HistoryItem key={i} onClick={() => setVal(item)}>
                    <span>{item}</span>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setHistory(h => h.filter((_, idx) => idx !== i));
                    }}>✕</button>
                  </HistoryItem>
              ))}
            </Dropdown>
        )}
      </Container>
  );
};