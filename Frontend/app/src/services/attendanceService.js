import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;

const getConfig = (token) => ({
    headers: {
        Authorization: token
    }
});

export async function markAttendance(token, attendanceData) {

    const response = await axios.post(
        `${BASE_URL}/attendance/mark`,
        attendanceData,
        getConfig(token)
    );

    return response.data;
}

export async function updateAttendance(
    token,
    attendanceId,
    attendanceData
) {

    const response = await axios.put(
        `${BASE_URL}/attendance/${attendanceId}`,
        attendanceData,
        getConfig(token)
    );

    return response.data;
}

export async function getSessionAttendance(token, sessionId) {

    const response = await axios.get(
        `${BASE_URL}/attendance/session/${sessionId}`,
        getConfig(token)
    );

    return response.data;
}

export async function getMyAttendance(token) {

    const response = await axios.get(
        `${BASE_URL}/attendance/my`,
        getConfig(token)
    );

    return response.data;
}

export async function getAttendanceById(token, attendanceId) {

    const response = await axios.get(
        `${BASE_URL}/attendance/${attendanceId}`,
        getConfig(token)
    );

    return response.data;
}