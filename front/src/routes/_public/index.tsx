import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "../../components/ui/Button.tsx";
import styled from "styled-components";
import {faAward, faBookOpen, faMusic, faPalette, faPuzzlePiece, faStar} from "@fortawesome/free-solid-svg-icons";
import {motion} from "motion/react";

export const Route = createFileRoute('/_public/')({
    component: Index,
})


const features = [
    {
        icon: faBookOpen,
        title: 'Interactive Stories',
        description: 'Engaging stories that bring reading to life with colorful animations and fun characters.',
        color: 'from-blue-400 to-blue-600'
    },
    {
        icon: faPuzzlePiece,
        title: 'Fun Puzzles',
        description: 'Brain-teasing puzzles and games designed to develop critical thinking skills.',
        color: 'from-purple-400 to-purple-600'
    },
    {
        icon: faStar,
        title: 'Reward System',
        description: 'Earn stars and badges as you learn, keeping motivation high and progress visible.',
        color: 'from-pink-400 to-pink-600'
    },
    {
        icon: faAward,
        title: 'Progress Tracking',
        description: 'Monitor your child\'s learning journey with detailed progress reports and insights.',
        color: 'from-yellow-400 to-orange-500'
    },
    {
        icon: faPalette,
        title: 'Creative Activities',
        description: 'Art and creativity exercises that spark imagination and self-expression.',
        color: 'from-green-400 to-teal-500'
    },
    {
        icon: faMusic,
        title: 'Learning Songs',
        description: 'Catchy educational songs that make memorization easy and enjoyable.',
        color: 'from-indigo-400 to-purple-600'
    }
];

function Index() {
    const navigate = useNavigate()

    const handleLearn = () => {
        navigate({to: '/math'}).then()
    }
    return <Screen>

        {/*Hero section */}
        <Hero>
            <Welcome>Welcome to Kid Learning</Welcome>

            <div>
                <h1>Make Learning Fun</h1>
                <h1>For Every Child</h1>
            </div>

            <div>
                <div>This app for kid learning brings education to life with interactive lessons,</div>
                <div> engaging activities, and
                    personalized learning paths designed specifically for young minds.
                </div>
            </div>

            <Button onClick={handleLearn}>Learning Now</Button>
        </Hero>

        {/*Features */}
        <FeaturesContainer>
            <h2>Everything Your Child Needs to Thrive</h2>
            <div>Discover a world of learning opportunities designed with love and care</div>
            <Features>
                {features.map(({icon, title, description}) => (
                    <MotionFeature
                        key={title}
                        whileHover={{translateY: -10, scale: 1.05}}
                    >
                        <FontAwesomeIcon icon={icon} size={'2xl'}/>
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </MotionFeature>
                ))}
            </Features>
        </FeaturesContainer>

        <Footer>
            © 2026 Kid Learning. Making education fun and accessible for every child.
        </Footer>
    </Screen>
}

const Screen = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 4rem;
        padding: 2rem;
    }
`


const Hero = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    justify-content: center;
    align-items: center;
    text-align: center;
`

const Welcome = styled.div`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: .5rem 1rem;
    box-shadow: var(--shadow-low);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--bg-color);
`

const FeaturesContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const Features = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
`

const Feature = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--surface-color);
`

const MotionFeature = motion(Feature)

const Footer = styled.footer`
    border: 1px solid var(--border-color);
    padding: 1rem;
    text-align: center;
    background-color: var(--surface-color);
`