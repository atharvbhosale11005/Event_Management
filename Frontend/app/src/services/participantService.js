import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;

const getConfig = (token) => ({
    headers: {
        Authorization: token
    }
});

export async function getParticipantProfile(token) {

    const response = await axios.get(
        `${BASE_URL}/participant/profile`,
        getConfig(token)
    );

    return response.data;
}

export async function getAllParticipants(token) {

    const response = await axios.get(
        `${BASE_URL}/participant/all`,
        getConfig(token)
    );

    return response.data;
}

export async function getParticipantById(token, participantId) {

    const response = await axios.get(
        `${BASE_URL}/participant/${participantId}`,
        getConfig(token)
    );

    return response.data;
}

export async function getParticipantEvents(token) {

    const response = await axios.get(
        `${BASE_URL}/participant/events`,
        getConfig(token)
    );

    return response.data;
}