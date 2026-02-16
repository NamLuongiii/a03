import {useState} from 'react';
import {Listbox} from '@headlessui/react';
import styled from 'styled-components';
import {useNavigate} from "@tanstack/react-router";

const categories = [
    {id: 1, name: 'All Categories'},
    {id: 2, name: 'Fiction'},
    {id: 3, name: 'Non-Fiction'},
    {id: 4, name: 'Science'},
    {id: 5, name: 'History'},
    {id: 6, name: 'Biography'},
];

const Container = styled.div`
    position: relative;
    width: 100%;
    max-width: 200px;
`;

const Button = styled(Listbox.Button)`
    width: 100%;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        border-color: #9ca3af;
    }
`;

const Options = styled(Listbox.Options)`
    position: absolute;
    margin-top: 0.5rem;
    width: 100%;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
    z-index: 10;
`;

const Option = styled(Listbox.Option)<{ $active?: boolean }>`
    padding: 0.75rem 1rem;
    cursor: pointer;
    background-color: ${props => props.$active ? '#f3f4f6' : 'white'};

    &:hover {
        background-color: #f3f4f6;
    }
`;

export const CategorySelect = () => {
    const [selected, setSelected] = useState(categories[0]);
    const navigate = useNavigate()
    const handleClick = () => {
        navigate({to: `/books`}).then()
    }
    return (
        <Container>
            <Listbox value={selected} onChange={() => {
                setSelected(categories[0])
                handleClick()
            }}>
                <Button>
                    <span>{selected.name}</span>
                    <span>▼</span>
                </Button>
                <Options>
                    {categories.map((category) => (
                        <Option
                            key={category.id}
                            value={category}
                            $active={selected.id === category.id}
                        >
                            {category.name}
                        </Option>
                    ))}
                </Options>
            </Listbox>
        </Container>
    );
};
