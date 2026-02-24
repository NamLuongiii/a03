import {HttpClient} from "../api/http-client.ts";
import {Books} from "../api/Books.ts";
import {Auth} from "../api/Auth.ts";

const httpClient = new HttpClient({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
    },
})

const apiBooks = new Books(httpClient)
const apiAuth = new Auth(httpClient)
export {apiBooks, apiAuth}