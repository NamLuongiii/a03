import styled from 'styled-components';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {Link} from "@tanstack/react-router";
import {toast} from "react-toastify";
import Avatar from "boring-avatars";
import {vi} from 'date-fns/locale';

// Nội bộ dự án
import {apiBooks} from "../services/ApiGenerate.ts";
import {Button} from "./ui/Button.tsx";
import {useAuth} from "../auth.tsx";
import type {ModelsAccount, ModelsComment} from "../api/data-contracts.ts";
import {formatDistanceToNow} from "date-fns";

// --- Styled Components (Modern Stark Style) ---

const Container = styled.div`
  margin: 4rem 0;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
    color: #18181b;
  }
  p {
    color: #71717a;
    font-size: 0.875rem;
  }
`;

const FormSection = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 3.5rem;
  align-items: flex-start;
`;

const InputStack = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e4e7;
  background: #fdfdfd;
  
  input {
    width: 100%;
    padding: 14px 16px;
    border: none;
    outline: none;
    font-size: 14px;
    background: transparent;
    color: #18181b;
    transition: background 0.2s;
    
    &:first-child {
      border-bottom: 1px solid #f4f4f5;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    
    &:focus {
      background: #fff;
    }

    &::placeholder {
      color: #a1a1aa;
      font-weight: 400;
      text-transform: none;
    }
  }
`;

const AuthPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  border: 1px solid #e4e4e7;
  background: #fafafa;
  margin-bottom: 3.5rem;
  text-align: center;
  
  p {
    color: #71717a;
    font-size: 14px;
    margin: 0;
  }
`;

const LoginLink = styled(Link)`
  color: #18181b;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid #18181b;
  margin-left: 4px;
  
  &:hover {
    opacity: 0.7;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 1.25rem;
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  span.name {
    font-size: 12px;
    font-weight: 700;
    color: #18181b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const CommentTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
  margin: 0;
`;

const CommentBody = styled.p`
  font-size: 14px;
  color: #52525b;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

// --- Logic Component ---

type TForm = { text: string; title: string; }
type Props = { bookID: string }

export const Comments = ({ bookID }: Props) => {
    const { register, handleSubmit, reset } = useForm<TForm>();
    const queryClient = useQueryClient();
    const { me, isAuthenticated } = useAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: TForm) => apiBooks.commentsCreate({ bookId: bookID }, data),
        onSuccess: (res) => {
            const newCmt = res.data.data as ModelsComment;
            newCmt.account = me as ModelsAccount;
            // Optimistic Update: Đưa comment mới lên đầu danh sách ngay lập tức
            queryClient.setQueryData(['get-comments', bookID], (old: ModelsComment[]) => [newCmt, ...(old || [])]);
            toast.success("Đã gửi bình luận của bạn");
            reset();
        },
        onError: () => {
            toast.error("Không thể gửi bình luận lúc này");
        }
    });

    const { data: comments = [] } = useQuery({
        queryKey: ['get-comments', bookID],
        queryFn: async () => {
            const res = await apiBooks.commentsList({ id: bookID });
            return res.data.data as ModelsComment[];
        }
    });

    return (
        <Container>
            <Header>
                <h2>Bình luận</h2>
                <p>Phản hồi từ độc giả</p>
            </Header>

            {isAuthenticated ? (
                <FormSection onSubmit={handleSubmit((d) => mutate(d))}>
                    <Avatar size={42} name={me?.name} variant="beam" />
                    <InputStack>
                        <input
                            placeholder="Tiêu đề cảm nhận..."
                            autoComplete="off"
                            {...register('title', { required: true })}
                        />
                        <input
                            placeholder="Chia sẻ suy nghĩ của bạn về cuốn sách..."
                            autoComplete="off"
                            {...register('text', { required: true })}
                        />
                    </InputStack>
                    <Button
                        type="submit"
                        isLoading={isPending}
                        style={{ height: '94px', minWidth: '80px' }}
                    >
                        Gửi
                    </Button>
                </FormSection>
            ) : (
                <AuthPrompt>
                    <Avatar size={40} variant="marble" colors={["#e4e4e7", "#d4d4d8"]} />
                    <p>
                        Bạn có điều muốn chia sẻ?
                        <LoginLink to="/login">Đăng nhập</LoginLink> để gửi bình luận.
                    </p>
                </AuthPrompt>
            )}

            <CommentList>
                {comments.length > 0 ? (
                    comments.map((cmt) => (
                        <CommentItem key={cmt.id}>
                            <Avatar size={36} name={cmt.account?.name} variant="marble" />
                            <CommentContent>
                                <AuthorInfo>
                                    <span className="name">{cmt.account?.name || "Độc giả ẩn danh"}</span>
                                    <span className="date">
        {cmt.created_at && formatDistanceToNow(new Date(cmt.created_at), {
            addSuffix: true,
            locale: vi
        })}
      </span>
                                </AuthorInfo>
                                <CommentTitle>{cmt.title}</CommentTitle>
                                <CommentBody>{cmt.content}</CommentBody>
                            </CommentContent>
                        </CommentItem>
                    ))
                ) : (
                    <p style={{ color: '#a1a1aa', fontSize: '14px', textAlign: 'center' }}>
                        Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!
                    </p>
                )}
            </CommentList>
        </Container>
    );
};