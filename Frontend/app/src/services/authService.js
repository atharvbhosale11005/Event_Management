import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;


// Register participant
export async function registerUser(userData) {

    const response = await axios.post(
        `${BASE_URL}/auth/register/user`,
        userData
    );

    return response.data;
}


// Login
export async function loginUser(email, password) {

    const response = await axios.post(
        `${BASE_URL}/auth/login`,
        {
            email,
            password
        }
    );

    return response.data;
}