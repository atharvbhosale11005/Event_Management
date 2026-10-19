import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;

const getConfig = (token) => ({
    headers: {
        Authorization: token
    }
});

export async function addFeedback(
    token,
    feedbackData
) {

    const response = await axios.post(
        `${BASE_URL}/feedback/add`,
        feedbackData,
        getConfig(token)
    );

    return response.data;
}

export async function getMyFeedback(token) {

    const response = await axios.get(
        `${BASE_URL}/feedback/my`,
        getConfig(token)
    );

    return response.data;
}

export async function getAllFeedback(token) {

    const response = await axios.get(
        `${BASE_URL}/feedback/all`,
        getConfig(token)
    );

    return response.data;
}

export async function getFeedbackByEvent(
    token,
    eventId
) {

    const response = await axios.get(
        `${BASE_URL}/feedback/event/${eventId}`,
        getConfig(token)
    );

    return response.data;
}

export async function getFeedbackById(
    token,
    feedbackId
) {

    const response = await axios.get(
        `${BASE_URL}/feedback/${feedbackId}`,
        getConfig(token)
    );

    return response.data;
}