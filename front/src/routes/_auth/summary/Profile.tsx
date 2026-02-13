import Avatar from "boring-avatars";
import {useAuth} from "../../../auth.tsx";
import styled from "styled-components";
import {useQuery} from "@tanstack/react-query";
import {ProfileService} from "../../../services/ProfileService.ts";
import {BarLoader} from "react-spinners";

export default function Profile() {
    const {profile} = useAuth()

    if (!profile) throw new Error('Profile not found')

    const { data, isLoading } = useQuery({
        queryKey: ['profile', profile.id],
        queryFn: () => ProfileService.getAllActivities(profile.id)
    })

    if (isLoading) return <BarLoader />

    return <Container>
        <div>
            <Avatar size={80}/>
            <h2>{profile?.name}</h2>
        </div>

        <StarEarned>
            {profile?.stars ? `Earned ${profile?.stars} stars` : 'No stars yet'}
        </StarEarned>

        <hr/>

        <ActivityContainer>
            <h2>Activities</h2>

            {data?.map((activity) => (
                <Activity key={activity.id}>
                    <h3>{activity.lesson_name}</h3>
                    <div>{activity.result}</div>
                    <div className='footer'>
                        <small>Earned {activity.earned_stars} stars</small>
                        <small>{new Date(activity.log_at).toDateString()}</small>
                    </div>
                </Activity>
            ))}
        </ActivityContainer>
    </Container>
}

const Container = styled.div`
    padding: 2rem;

    & > * {
        margin-bottom: 1rem;
    }
`

const StarEarned = styled.div`
    display: flex;
    gap: 1rem;
    font-size: 2rem;
    width: fit-content;
    margin: 2rem auto;
    padding: 1rem;
    border-radius: 1rem;
    background-color: var(--surface-color);
    box-shadow: var(--shadow-low);
    align-items: center;
`

const ActivityContainer = styled.div`
    display: flex;
    gap: 1rem;
    flex-direction: column;
`

const Activity = styled.div`
    background-color: var(--surface-color);
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: var(--shadow-low);
    display: flex;
    flex-direction: column;
    gap: 1rem;


    .footer {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
    }
`