import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;

const getConfig = (token) => ({
    headers: {
        Authorization: token
    }
});

export async function registerForEvent(token, eventId) {

    const response = await axios.post(
        `${BASE_URL}/registration/add`,
        {
            event_id: Number(eventId)
        },
        getConfig(token)
    );

    return response.data;
}

export async function cancelRegistration(token, eventId) {

    const response = await axios.delete(
        `${BASE_URL}/registration/${eventId}`,
        getConfig(token)
    );

    return response.data;
}

export async function getMyRegistrations(token) {

    const response = await axios.get(
        `${BASE_URL}/registration/my`,
        getConfig(token)
    );

    return response.data;
}

export async function getEventParticipants(token, eventId) {

    const response = await axios.get(
        `${BASE_URL}/registration/event/${eventId}`,
        getConfig(token)
    );

    return response.data;
}