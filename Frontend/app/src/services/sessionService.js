import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;

const getConfig = (token) => ({
    headers: {
        Authorization: token
    }
});

export async function getSessionsByEvent(token, eventId) {

    const response = await axios.get(
        `${BASE_URL}/session/event/${eventId}`,
        getConfig(token)
    );

    return response.data;
}

export async function getSessionById(token, sessionId) {

    const response = await axios.get(
        `${BASE_URL}/session/${sessionId}`,
        getConfig(token)
    );

    return response.data;
}

export async function addSession(token, sessionData) {

    const response = await axios.post(
        `${BASE_URL}/session/add`,
        sessionData,
        getConfig(token)
    );

    return response.data;
}

export async function updateSession(
    token,
    sessionId,
    sessionData
) {

    const response = await axios.put(
        `${BASE_URL}/session/${sessionId}`,
        sessionData,
        getConfig(token)
    );

    return response.data;
}

export async function deleteSession(token, sessionId) {

    const response = await axios.delete(
        `${BASE_URL}/session/${sessionId}`,
        getConfig(token)
    );

    return response.data;
}