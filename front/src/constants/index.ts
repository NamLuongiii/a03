export const MUTATION_KEYS = {
    LOGIN: "login",
    LOGOUT: "logout",
    REGISTER: "register",
    SEND_CODE: "sendCode",
    VERIFY_CODE: "verifyCode",
    FORGOT_PASSWORD: "forgotPassword",
    NEW_ROOM: "newRoom",
    FINISH_ROOM: "findRoom",
} as const;

export const QUERY_KEYS = {
    ROOMS: "rooms",
    GET_ROOM: "getRoom",
} as const;
