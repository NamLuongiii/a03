import styled from 'styled-components';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiBooks} from "../services/ApiGenerate.ts";
import {useForm} from "react-hook-form";
import {Button} from "@components/ui/Button.tsx";
import type {ModelsAccount, ModelsComment} from "../api/data-contracts.ts";
import Avatar from "boring-avatars";
import {useAuth} from "../auth.tsx";

const Container = styled.div`
    position: relative;
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

const FormContainer = styled.form`
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
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

const MessageContent = styled.div``;

const Author = styled.p`
    font-weight: 600;
`;

const Text = styled.p`
    color: #374151;
`;

type TForm = {
    text: string;
     title: string;
}

type Props = {
    bookID: string
}

export const Comments = ({bookID}: Props) => {
    const { register, handleSubmit } = useForm<TForm>()
    const queryClient = useQueryClient();
    const { me } = useAuth()

    const { mutateAsync, isPending } = useMutation({
        mutationKey: ['comments'],
        mutationFn: (data: TForm) => apiBooks.commentsCreate({ bookId: bookID}, data),
        onSuccess: res => {
            const cmt = res.data.data as ModelsComment;
            cmt.account = me as ModelsAccount
            console.log(cmt);
            // push new comment to the list
            queryClient.setQueryData(['get-comments', bookID], (old: ModelsComment[]) => [cmt, ...old])
        }
    })

    const { data } = useQuery({
        queryKey: ['get-comments', bookID],
        queryFn: async () => {
            const res = await  apiBooks.commentsList({ id: bookID })
            return res.data.data as ModelsComment[]
        }
    })

    const onSubmit = handleSubmit(d => mutateAsync(d))

    const comments = (data || []) as ModelsComment[]

    return (
        <Container>
            <Title>Bình luận</Title>
            <Subtitle>Chia sẻ suy nghĩ của bạn về sách</Subtitle>

            <FormContainer onSubmit={onSubmit} >
                <Avatar>👤</Avatar>
                <input type="text" placeholder="tiêu đề..." {...register('title')}/>
                <input type="text" placeholder="Để lại cảm nhận..." {...register('text')}/>
                <Button type="submit" isLoading={isPending}>Gửi</Button>
            </FormContainer>

            <MessageList>
                {comments.map((cmt) => (
                    <Message key={cmt.id}>
                        <Avatar></Avatar>
                        <MessageContent>
                            <Author>{cmt.account?.name}</Author>
                            <Text>{cmt.title}</Text>
                            <Text>{cmt.content}</Text>
                        </MessageContent>
                    </Message>
                ))}
            </MessageList>
        </Container>
    );
};
