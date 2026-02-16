import { Popover } from '@headlessui/react';
import styled from 'styled-components';

const Button = styled(Popover.Button)`
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #d1d5db;
  }
`;

const Panel = styled(Popover.Panel)`
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const EmailSection = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Email = styled.p`
  font-size: 0.875rem;
  color: #374151;
`;

const LogoutButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const UserMenu = () => {
  const userEmail = 'user@example.com';

  return (
    <Popover style={{ position: 'relative' }}>
      <Button>Profile</Button>
      <Panel>
        <EmailSection>
          <Email>{userEmail}</Email>
        </EmailSection>
        <LogoutButton>Logout</LogoutButton>
      </Panel>
    </Popover>
  );
};
