import {Button} from "../../../components/ui/Button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Modal from "../../../components/ui/Modal.tsx";
import {Input} from "../../../components/ui/Input.tsx";
import {useForm} from "react-hook-form";
import styled from "styled-components";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ProfileService} from "../../../services/ProfileService.ts";
import {Loading} from "../../../components/Loading.tsx";
import type {ProfileDto} from "../../../types/dto.ts";
import type {Profile} from "../../../types";
import {useAuth} from "../../../auth.tsx";
import {useNavigate} from "@tanstack/react-router";


export default function Profiles() {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const {selectProfile} = useAuth()
    const navigate = useNavigate()

    const {data, isLoading} = useQuery({
        queryKey: ['profiles'],
        queryFn: () => ProfileService.getAllProfiles(),
    })

    const {isPending, mutateAsync} = useMutation({
        mutationKey: ['profiles'],
        mutationFn: (data: ProfileDto) => ProfileService.createProfile(data),
    })

    const {register, handleSubmit} = useForm({
        defaultValues: {
            name: '',
            birthYear: undefined,
        }
    })

    const onSubmit = handleSubmit(async (data) => {
        mutateAsync(data as unknown as ProfileDto).then(profile => {
            queryClient.setQueryData<Profile[]>(['profiles'], (oldData) => [...oldData!, profile])
            setOpen(false)
        })
    })

    if (isLoading) return <Loading/>

    return <Container>
        <h1>Select profile for your kid</h1>

        {data?.map((profile) => (
            <div className="kid" key={profile.id} onClick={() => {
                selectProfile(profile)
                navigate({to: '/'}).then()
            }}>{profile.name}</div>
        ))}

        <div>
            <Button type='button' isFullWidth onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={faPlus}/>
                Create new</Button>
        </div>

        <Modal open={open} setIsOpen={setOpen}>
            <FormCreate onSubmit={onSubmit}>
                <h1>Create a profile for your kid</h1>
                <Input id='name' icon={<></>} label='Kid name' inputProps={{
                    ...register('name'),
                }}/>

                <Input id='birthYear' icon={<></>} label='Birth year' inputProps={{
                    ...register('birthYear'),
                    type: 'number'
                }}/>

                <Button type='submit' isFullWidth={true} isLoading={isPending}>ADD</Button>
            </FormCreate>
        </Modal>
    </Container>
}

const Container = styled.div`
    width: fit-content;
    background-color: var(--surface-color);
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: var(--shadow-high);

    display: flex;
    gap: 1rem;
    flex-direction: column;
    margin: 2rem auto;

    .kid {
        padding: 1rem;
        font-size: 2rem;
        border: 1px solid var(--border-color);

        &:hover {
            cursor: pointer;
        }
    }
`

const FormCreate = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`