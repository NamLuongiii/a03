import styled from "styled-components";
import {useState} from "react";
import achivement from '../../../assets/Achievement.svg'
import {useMutation} from "@tanstack/react-query";
import {ProfileService} from "../../../services/ProfileService.ts";
import {useAuth} from "../../../auth.tsx";
import {PacmanLoader} from "react-spinners";
import {Button} from "../../../components/ui/Button.tsx";
import {Link} from "@tanstack/react-router";
import type {ActivityDto} from "../../../types/dto.ts";

type Question = {
    question: string;
    answers: number[];
    rightAnswer: number;
}

function shuffle(arr: number[]) {
    const newArr = [...arr];

    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }

    return newArr;
}

function generateQuestions() {
    const questions: Question[] = [];
    const n = 5

    for (let i = 1; i <= n; i++) {
        const a = Math.round(Math.random() * 10)
        const b = Math.round(Math.random() * 10)
        const d = a + b


        questions.push({
            question: `${a} + ${b} = ?`,
            answers: shuffle([d - 2, d - 1, d, d + 2]),
            rightAnswer: d
        })
    }

    return questions;
}

export default function LearnMath() {
    const [questions, setQuestions] = useState<Question[]>(generateQuestions())
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
    const [answer, setAnswer] = useState<number | undefined>(undefined)
    const [result, setResult] = useState<boolean[]>([])
    const [showResult, setShowResult] = useState(false)
    const {profile} = useAuth()

    if (!profile) throw new Error('Profile not found')

    const {mutateAsync, isPending} = useMutation({
        mutationKey: ['save-activity'],
        mutationFn: (data: ActivityDto) => ProfileService.createActivity(profile.id, data)
    })

    const selectAnswer = (index: number, question: Question, answer: number) => {
        setResult(old => {
            old[index] = question.rightAnswer === answer
            return [...old]
        })
        setAnswer(answer)
    }

    const handleNext = () => {
        if (selectedQuestionIndex + 1 === questions.length) {
            return handleFinish()
        }
        setSelectedQuestionIndex(selectedQuestionIndex + 1)
        setAnswer(undefined)
    }

    const handleFinish = () => {
        const rightAnswers = result.filter(a => a).length

        mutateAsync({
            earned_stars: rightAnswers,
            lesson_name: 'Math',
            result: `${rightAnswers} out of ${questions.length} questions correct!`

        }).then(() => setShowResult(true))
    }

    const tryAgain = () => {
        setSelectedQuestionIndex(0)
        setAnswer(undefined)
        setResult([])
        setQuestions(generateQuestions())
        setShowResult(false)
    }

    const question = questions[selectedQuestionIndex]
    const isAnswerCorrect = answer !== undefined && answer === question.rightAnswer

    return <Screen>
        <header>
            <div>Math</div>

            <div>{selectedQuestionIndex + 1}/{questions.length}</div>
        </header>

        {isPending && <PacmanLoader/>}

        {!showResult ? (
            <main>
                <p>{question.question}</p>

                <div className='answers'>
                    {question.answers.map(ans => (
                        <div
                            className={ans === answer ? (isAnswerCorrect ? 'correct' : 'wrong') : ''}
                            key={ans}
                            onClick={() => selectAnswer(selectedQuestionIndex, question, ans)}
                        >{ans}
                        </div>
                    ))}
                </div>

                {!!answer && (
                    isAnswerCorrect ?
                        <div>Great job! You got it right! 🌟👏</div>
                        :
                        <div>That’s okay! Try again, you can do it! 💪😊</div>

                )}

                {answer !== undefined && (
                    <button onClick={handleNext}>Next</button>
                )}
            </main>) : (
            <main>
                <img src={achivement} alt="achie"/>
                <h1>Result</h1>
                <p>You got {result.filter(a => a).length} out of {questions.length} questions correct!</p>
                <p>Your earned {result.filter(a => a).length} stars</p>

                <Button type='button' onClick={tryAgain}>Try again</Button>
                <Link to='/'><Button type='button'>Go home</Button></Link>
            </main>)}
    </Screen>
}

const Screen = styled.div`
    header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 2rem;
        border-bottom: 1px solid var(--border-color);
        font-size: 1.5rem;
    }

    main {
        padding: 2rem;
        display: flex;

        flex-direction: column;
        gap: 1rem;
        margin: 2rem auto;
        text-align: center;
        font-size: 1.5rem;
        background-color: var(--surface-color);
        width: fit-content;
    }

    .answers {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin: 1rem auto;

        > div {
            padding: .5rem 1rem;
            cursor: pointer;
            border: 1px solid var(--border-color);
            border-radius: 1rem;

            &.correct {
                outline: 2px solid var(--success-color);
            }

            &.wrong {
                outline: 2px solid var(--error-color);
            }
        }
    }
`