export interface User {
    id: number;
    name: string;
    email: string;
    // other user fields
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface Room {
    id: number;
    name: string;
    created_by_user?: User;
    description: string;
}

export type Profile = {
    id: number;
    name: string;
    stars: number;
    birth_year: number;
    account_id: number;
}

export type Activity = {
    id: number;
    lesson_name: string;
    result: string;
    earned_stars: number;
    profile_id: number;
    log_at: string;
}