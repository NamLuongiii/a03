import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f3f4f6;
  padding: 2rem;
  margin-top: auto;
`;

const Text = styled.p`
  text-align: center;
  color: #4b5563;
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <Text>© 2024 Your Company. All rights reserved.</Text>
    </FooterContainer>
  );
};
