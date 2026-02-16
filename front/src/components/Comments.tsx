import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1.5rem 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #4b5563;
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  font-size: 1.875rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;

  &:focus {
    ring: 2px;
    ring-color: #3b82f6;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const MessageAvatar = styled.div`
  font-size: 1.5rem;
`;

const MessageContent = styled.div``;

const Author = styled.p`
  font-weight: 600;
`;

const Text = styled.p`
  color: #374151;
`;

export const Comments = () => {
  const [comment, setComment] = useState('');
  const messages = [
    { avatar: '👤', text: 'Great product!', author: 'User 1' },
    { avatar: '👤', text: 'I love it!', author: 'User 2' },
    { avatar: '👤', text: 'Highly recommended', author: 'User 3' },
  ];

  return (
    <Container>
      <Title>Comments</Title>
      <Subtitle>Share your thoughts</Subtitle>

      <InputContainer>
        <Avatar>👤</Avatar>
        <Input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </InputContainer>

      <MessageList>
        {messages.map((message, index) => (
          <Message key={index}>
            <MessageAvatar>{message.avatar}</MessageAvatar>
            <MessageContent>
              <Author>{message.author}</Author>
              <Text>{message.text}</Text>
            </MessageContent>
          </Message>
        ))}
      </MessageList>
    </Container>
  );
};
