import {useRef, useState} from 'react';
import styled from 'styled-components';
import {Search} from 'lucide-react';
import {useNavigate} from "@tanstack/react-router";

// --- Styled Components ---

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 32rem; /* Tăng nhẹ độ rộng cho cân đối */
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  background: var(--zinc-100); /* Màu nền nhạt để tách biệt với Header */
  transition: all 0.2s ease;

  &:focus-within {
    border-color: var(--zinc-900);
    background: var(--surface-color);
    box-shadow: inset 0 0 0 1px var(--zinc-900);
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 40px; /* Khớp chiều cao với CategorySelect */
  padding: 0 3rem 0 1rem;
  background: transparent;
  border: none;
  border-radius: 0;
  font-size: 13px;
  color: var(--text-main);
  outline: none;

  &::placeholder {
    color: var(--zinc-400);
    letter-spacing: 0.025em;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  height: 100%;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--zinc-500);
  transition: color 0.2s;

  &:hover {
    color: var(--zinc-900);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: -1px; /* Khít với InputWrapper */
  background: var(--surface-color);
  border: 1px solid var(--zinc-900);
  border-radius: 0;
  z-index: 60;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    background: var(--zinc-50);
    color: var(--text-main);
  }
  
  span.remove-btn { 
    font-size: 10px;
    opacity: 0.4;
    padding: 4px;
    &:hover { 
      opacity: 1;
      color: var(--danger);
    }
  }
`;

// --- Component ---

export const SearchBox = () => {
  const [val, setVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

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
          <StyledInput
              ref={inputRef}
              placeholder="TÌM KIẾM TÊN SÁCH, TÁC GIẢ..."
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchButton onClick={handleSearch} aria-label="Search">
            <Search size={16} strokeWidth={2.5} />
          </SearchButton>
        </InputWrapper>

        {isFocused && history.length > 0 && (
            <Dropdown>
              {history.map((item, i) => (
                  <HistoryItem key={i} onClick={() => {
                    setVal(item);
                    handleSearch();
                  }}>
                    <span>{item}</span>
                    <span className="remove-btn" onClick={(e) => {
                      e.stopPropagation();
                      setHistory(h => h.filter((_, idx) => idx !== i));
                    }}>✕</span>
                  </HistoryItem>
              ))}
            </Dropdown>
        )}
      </Container>
  );
};