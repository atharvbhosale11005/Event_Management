import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;

const getConfig = (token) => ({
    headers: {
        Authorization: token
    }
});


export async function getAllEvents(token) {

    const response = await axios.get(
        `${BASE_URL}/event/all`,
        getConfig(token)
    );

    return response.data;
}


export async function getEventById(token, eventId) {

    const response = await axios.get(
        `${BASE_URL}/event/${eventId}`,
        getConfig(token)
    );

    return response.data;
}


export async function addEvent(token, eventData) {

    const response = await axios.post(
        `${BASE_URL}/event/add`,
        eventData,
        getConfig(token)
    );

    return response.data;
}


export async function updateEvent(token, eventId, eventData) {

    const response = await axios.put(
        `${BASE_URL}/event/${eventId}`,
        eventData,
        getConfig(token)
    );

    return response.data;
}


export async function deleteEvent(token, eventId) {

    const response = await axios.delete(
        `${BASE_URL}/event/${eventId}`,
        getConfig(token)
    );

    return response.data;
}