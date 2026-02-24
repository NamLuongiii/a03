import {Listbox} from '@headlessui/react';
import styled from 'styled-components';
import {useNavigate} from "@tanstack/react-router";
import {useQuery} from "@tanstack/react-query";
import {apiBooks} from "../services/ApiGenerate.ts";
import type {ModelsCategory} from "../api/data-contracts.ts";

const Wrapper = styled.div`
  position: relative;
  width: 200px;
`;

const StyledButton = styled(Listbox.Button)`
  width: 100%;
  padding: 0.6rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  text-align: left;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover { border-color: #3b82f6; }
`;

const StyledOptions = styled(Listbox.Options)`
  position: absolute;
  width: 100%;
  margin-top: 0.4rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 20;

  /* Giới hạn chiều cao và cho phép cuộn */
  max-height: 250px; 
  overflow-y: auto;

  /* Tùy chỉnh thanh cuộn (scrollbar) cho tinh tế hơn */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const StyledOption = styled(Listbox.Option)`
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  &[data-active] { background-color: #f3f4f6; color: #3b82f6; }
  &[data-selected] { font-weight: bold; background-color: #eff6ff; }
`;

export const CategorySelect = () => {
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ['categories'],
        queryFn: () => apiBooks.categoriesList(),
        staleTime: Infinity
    });

    const categories = data?.data?.data || [];

    const handleSelect = (category: ModelsCategory) => {
        navigate({
            to: '/books',
            search: { category: category.id, page: 1, size: 12 } // Redirect với query param
        });
    };

    return (
        <Wrapper>
            <Listbox onChange={handleSelect}>
                <StyledButton>
                    <span>Thể loại sách</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>▼</span>
                </StyledButton>
                <StyledOptions>
                    {categories.map((cat: ModelsCategory) => (
                        <StyledOption key={cat.id} value={cat}>
                            {cat.name}
                        </StyledOption>
                    ))}
                </StyledOptions>
            </Listbox>
        </Wrapper>
    );
};