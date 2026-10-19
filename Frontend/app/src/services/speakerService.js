import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;

const getConfig = (token) => ({
    headers: {
        Authorization: token
    }
});

export async function getAllSpeakers(token) {

    const response = await axios.get(
        `${BASE_URL}/speaker/all`,
        getConfig(token)
    );

    return response.data;
}

export async function getSpeakerById(token, speakerId) {

    const response = await axios.get(
        `${BASE_URL}/speaker/${speakerId}`,
        getConfig(token)
    );

    return response.data;
}

export async function addSpeaker(token, speakerData) {

    const response = await axios.post(
        `${BASE_URL}/speaker/add`,
        speakerData,
        getConfig(token)
    );

    return response.data;
}

export async function updateSpeaker(
    token,
    speakerId,
    speakerData
) {

    const response = await axios.put(
        `${BASE_URL}/speaker/${speakerId}`,
        speakerData,
        getConfig(token)
    );

    return response.data;
}

export async function deleteSpeaker(token, speakerId) {

    const response = await axios.delete(
        `${BASE_URL}/speaker/${speakerId}`,
        getConfig(token)
    );

    return response.data;
}

export async function assignSpeaker(
    token,
    sessionId,
    speakerId
) {

    const response = await axios.post(
        `${BASE_URL}/speaker/assign`,
        {
            session_id: Number(sessionId),
            speaker_id: Number(speakerId)
        },
        getConfig(token)
    );

    return response.data;
}

export async function getSessionSpeakers(
    token,
    sessionId
) {

    const response = await axios.get(
        `${BASE_URL}/speaker/session/${sessionId}`,
        getConfig(token)
    );

    return response.data;
}

export async function removeSpeaker(
    token,
    sessionId,
    speakerId
) {

    const response = await axios.delete(
        `${BASE_URL}/speaker/session/${sessionId}/speaker/${speakerId}`,
        getConfig(token)
    );

    return response.data;
}