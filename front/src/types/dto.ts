export type ProfileDto = {
    name: string
    birthYear: number
}

export type LoginDto = {
    email: string
    password: string
}

export  type ActivityDto = {
    earned_stars: number,
    lesson_name: string,
    result: string
}