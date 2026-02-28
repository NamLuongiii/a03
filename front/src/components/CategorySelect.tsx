import {Listbox, Transition} from '@headlessui/react';
import styled from 'styled-components';
import {Fragment} from 'react';
import {useNavigate} from "@tanstack/react-router";
import {useQuery} from "@tanstack/react-query";
import {apiBooks} from "../services/ApiGenerate.ts";
import type {ModelsCategory} from "../api/data-contracts.ts";
import {ChevronDown} from "lucide-react";

// --- Styled Components ---

const Wrapper = styled.div`
  position: relative;
  width: 180px; /* Thu gọn một chút cho tinh tế */
`;

const StyledButton = styled(Listbox.Button)`
  width: 100%;
  height: 40px; /* Khớp chiều cao với các thành phần khác trên Header */
  padding: 0 1rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-none); /* Sắc sảo */
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--zinc-400);
  }

  &[data-active] {
    border-color: var(--zinc-900);
  }
`;

const StyledOptions = styled(Listbox.Options)`
  position: absolute;
  width: 100%;
  margin-top: -1px; /* Đè lên border dưới của button tạo khối thống nhất */
  background: var(--surface-color);
  border: 1px solid var(--zinc-900);
  border-radius: var(--radius-none);
  box-shadow: var(--shadow-high);
  z-index: 50;
  outline: none;

  max-height: 300px; 
  overflow-y: auto;

  /* Scrollbar Industrial */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--zinc-300); }
`;

const StyledOption = styled(Listbox.Option)`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-muted);
  transition: all 0.15s ease;

  &[data-focus] {
    background-color: var(--zinc-100);
    color: var(--text-main);
  }

  &[data-selected] {
    background-color: var(--zinc-900);
    color: white;
    font-weight: 600;
  }
`;

// --- Component ---

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
            search: (prev: any) => ({
                ...prev,
                category: category.id,
                page: 1
            })
        });
    };

    return (
        <Wrapper>
            <Listbox onChange={handleSelect}>
                <StyledButton>
                    <span>Thể loại</span>
                    <ChevronDown size={14} style={{ opacity: 0.8 }} />
                </StyledButton>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <StyledOptions>
                        {categories.map((cat: ModelsCategory) => (
                            <StyledOption key={cat.id} value={cat}>
                                {cat.name}
                            </StyledOption>
                        ))}
                    </StyledOptions>
                </Transition>
            </Listbox>
        </Wrapper>
    );
};