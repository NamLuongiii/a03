import {Menu, Transition} from '@headlessui/react';
import styled from 'styled-components';
import {Fragment} from 'react';
import type {ModelsBook} from "../api/data-contracts.ts";
import {saveAs} from "file-saver";
import prettyBytes from "pretty-bytes";
import {Button} from "@components/ui/Button.tsx";

// --- Styled Components ---
const DownloadContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const FileList = styled(Menu.Items)`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  min-width: 240px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 4px;
  z-index: 20;
  outline: none;
`;

const FileItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${props => props.$active ? '#f3f4f6' : 'transparent'};
  color: #374151;
  
  span.size {
    font-size: 12px;
    color: #6b7280;
  }
`;

// --- Component ---
export function DownloadDropdown({ book }: {book: ModelsBook}) {
    return (
        <DownloadContainer>
            <Menu>
                <Menu.Button as={Button}>
                    Tải về
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <FileList>
                        {book.digital_books?.map((file) => (
                            <Menu.Item key={file.id}>
                                {({ active }) => (
                                    <FileItem
                                        $active={active}
                                        onClick={() => file.url && saveAs(file.url, file.name)}
                                    >
                                        <strong>{file.file_type?.toUpperCase()}</strong>
                                        <span className="size">{prettyBytes(file.file_size || 0)}</span>
                                    </FileItem>
                                )}
                            </Menu.Item>
                        ))}
                    </FileList>
                </Transition>
            </Menu>
        </DownloadContainer>
    );
}