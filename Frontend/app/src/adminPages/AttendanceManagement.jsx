import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";

import { getAllEvents } from "../services/eventService";
import { getSessionsByEvent } from "../services/sessionService";

import {
    getEventParticipants
} from "../services/registrationService";

import {
    getSessionAttendance,
    markAttendance,
    updateAttendance
} from "../services/attendanceService";

function AttendanceManagement() {

    const token = sessionStorage.getItem("token");

    const [events, setEvents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedSession, setSelectedSession] = useState("");

    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {

        try {

            const result = await getAllEvents(token);

            if (result.status === "success") {
                setEvents(result.data);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    const handleEventChange = async (eventId) => {

        setSelectedEvent(eventId);
        setSelectedSession("");
        setSessions([]);
        setParticipants([]);
        setAttendance([]);

        if (!eventId) {
            return;
        }

        try {

            setLoading(true);

            const [
                sessionResult,
                participantResult
            ] = await Promise.all([
                getSessionsByEvent(token, eventId),
                getEventParticipants(token, eventId)
            ]);

            if (sessionResult.status === "success") {
                setSessions(sessionResult.data);
            }

            if (participantResult.status === "success") {
                setParticipants(participantResult.data);
            }

        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleSessionChange = async (sessionId) => {

        setSelectedSession(sessionId);
        setAttendance([]);

        if (!sessionId) {
            return;
        }

        try {

            setLoading(true);

            const result = await getSessionAttendance(
                token,
                sessionId
            );

            if (result.status === "success") {
                setAttendance(result.data);
            }

        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const getParticipantId = (participant) => {

        return (
            participant.participant_id ||
            participant.user_id ||
            participant.id
        );
    };

    const getParticipantAttendance = (participant) => {

        const participantId = getParticipantId(participant);

        return attendance.find(
            item =>
                Number(item.participant_id) ===
                Number(participantId)
        );
    };

    const getAttendanceStatus = (participant) => {

        const existingAttendance =
            getParticipantAttendance(participant);

        if (!existingAttendance) {
            return "ABSENT";
        }

        return existingAttendance.status;
    };

    const saveAttendance = async (
        participant,
        status
    ) => {

        const participantId =
            getParticipantId(participant);

        if (!participantId || !selectedSession) {
            return;
        }

        try {

            setSavingId(participantId);

            const existingAttendance =
                getParticipantAttendance(participant);

            let result;

            if (existingAttendance) {

                result = await updateAttendance(
                    token,
                    existingAttendance.id,
                    {
                        status
                    }
                );

            }
            else {

                result = await markAttendance(
                    token,
                    {
                        session_id: Number(selectedSession),
                        participant_id: Number(participantId),
                        status
                    }
                );

            }

            if (result.status === "success") {

                const updatedAttendance =
                    await getSessionAttendance(
                        token,
                        selectedSession
                    );

                if (updatedAttendance.status === "success") {
                    setAttendance(updatedAttendance.data);
                }
            }

        }
        catch (error) {
            console.log(error);
        }
        finally {
            setSavingId(null);
        }
    };

    const selectClass =
        "w-full border border-gray-300 rounded-xl px-4 py-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .animate-fade-up { animation: fadeUp 0.5s ease-out both; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out both; }
            `}</style>

            <AdminNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

                <div className="mb-8 animate-fade-up">

                    <div className="flex items-center gap-3 mb-2">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white text-xl shadow-lg shadow-red-200">
                            ✓
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            Attendance Management
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        Manage participant attendance for event sessions.
                    </p>

                </div>

                {/* Selection Section */}

                <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-6 mb-6 animate-fade-up">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

                        {/* Event */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Event
                            </label>

                            <select
                                value={selectedEvent}
                                onChange={(e) =>
                                    handleEventChange(e.target.value)
                                }
                                className={selectClass}
                            >

                                <option value="">
                                    Select Event
                                </option>

                                {events.map((event) => (

                                    <option
                                        key={event.id}
                                        value={event.id}
                                    >
                                        {event.name}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* Session */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Session
                            </label>

                            <select
                                value={selectedSession}
                                onChange={(e) =>
                                    handleSessionChange(e.target.value)
                                }
                                disabled={!selectedEvent}
                                className={selectClass}
                            >

                                <option value="">
                                    Select Session
                                </option>

                                {sessions.map((session) => (

                                    <option
                                        key={session.id}
                                        value={session.id}
                                    >
                                        {session.name}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                </div>

                {/* Loading */}

                {loading && (

                    <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg p-8 sm:p-10 text-center animate-fade-in">

                        <div className="mx-auto h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />

                        <p className="text-gray-600 text-sm sm:text-base">
                            Loading...
                        </p>

                    </div>

                )}

                {/* No Session */}

                {!loading && selectedEvent && !selectedSession && (

                    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl shadow-lg p-8 sm:p-12 text-center animate-fade-up">

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 text-3xl">
                            🎯
                        </div>

                        <p className="text-gray-500 text-sm sm:text-base">
                            Select a session to manage attendance.
                        </p>

                    </div>

                )}

                {/* Attendance Table */}

                {!loading &&
                    selectedSession &&
                    (

                        <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-up">

                            <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                    Participant Attendance
                                </h2>

                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {participants.length} registered participant(s)
                                </p>

                            </div>

                            {participants.length === 0 ? (

                                <div className="p-8 sm:p-12 text-center">

                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-3xl">
                                        👥
                                    </div>

                                    <p className="text-gray-500 text-sm sm:text-base">
                                        No participants are registered for this event.
                                    </p>

                                </div>

                            ) : (

                                <>
                                    {/* Desktop Table */}

                                    <div className="hidden md:block overflow-x-auto">

                                        <table className="w-full">

                                            <thead className="bg-gradient-to-r from-slate-100 to-slate-50">

                                                <tr>

                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                        #
                                                    </th>

                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                        Participant
                                                    </th>

                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                        Email
                                                    </th>

                                                    <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                        Attendance
                                                    </th>

                                                    <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                        Action
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody className="divide-y divide-gray-100">

                                                {participants.map(
                                                    (participant, index) => {

                                                        const participantId =
                                                            getParticipantId(
                                                                participant
                                                            );

                                                        const currentStatus =
                                                            getAttendanceStatus(
                                                                participant
                                                            );

                                                        const existingAttendance =
                                                            getParticipantAttendance(
                                                                participant
                                                            );

                                                        return (

                                                            <tr
                                                                key={participantId}
                                                                className="hover:bg-blue-50/60 transition-colors duration-200"
                                                            >

                                                                <td className="px-6 py-4 text-gray-600">
                                                                    {index + 1}
                                                                </td>

                                                                <td className="px-6 py-4">

                                                                    <p className="font-medium text-gray-800">
                                                                        {
                                                                            participant.name ||
                                                                            participant.full_name ||
                                                                            participant.participant_name ||
                                                                            "Participant"
                                                                        }
                                                                    </p>

                                                                </td>

                                                                <td className="px-6 py-4 text-gray-600">
                                                                    {
                                                                        participant.email ||
                                                                        participant.participant_email ||
                                                                        "-"
                                                                    }
                                                                </td>

                                                                <td className="px-6 py-4 text-center">

                                                                    <select
                                                                        value={currentStatus}
                                                                        onChange={(e) =>
                                                                            saveAttendance(
                                                                                participant,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            savingId ===
                                                                            participantId
                                                                        }
                                                                        className={`px-3 py-2 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                                                                            currentStatus ===
                                                                            "PRESENT"
                                                                                ? "border-green-300 bg-green-50 text-green-700 focus:ring-green-400"
                                                                                : "border-red-300 bg-red-50 text-red-700 focus:ring-red-400"
                                                                        } focus:outline-none focus:ring-2`}
                                                                    >

                                                                        <option value="PRESENT">
                                                                            PRESENT
                                                                        </option>

                                                                        <option value="ABSENT">
                                                                            ABSENT
                                                                        </option>

                                                                    </select>

                                                                </td>

                                                                <td className="px-6 py-4 text-center">

                                                                    {savingId ===
                                                                    participantId ? (

                                                                        <span className="inline-flex items-center gap-2 text-sm text-gray-500">

                                                                            <span className="h-3 w-3 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />

                                                                            Saving...

                                                                        </span>

                                                                    ) : existingAttendance ? (

                                                                        <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">

                                                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                                                                            Saved

                                                                        </span>

                                                                    ) : (

                                                                        <span className="text-sm text-gray-400">
                                                                            Not marked
                                                                        </span>

                                                                    )}

                                                                </td>

                                                            </tr>

                                                        );
                                                    }
                                                )}

                                            </tbody>

                                        </table>

                                    </div>


                                    {/* Mobile Cards */}

                                    <div className="md:hidden divide-y divide-gray-100">

                                        {participants.map(
                                            (participant, index) => {

                                                const participantId =
                                                    getParticipantId(
                                                        participant
                                                    );

                                                const currentStatus =
                                                    getAttendanceStatus(
                                                        participant
                                                    );

                                                const existingAttendance =
                                                    getParticipantAttendance(
                                                        participant
                                                    );

                                                return (

                                                    <div
                                                        key={participantId}
                                                        className="p-5 space-y-3"
                                                    >

                                                        <div className="flex items-start justify-between gap-3">

                                                            <div className="min-w-0">

                                                                <p className="font-semibold text-slate-900 text-sm truncate">
                                                                    {index + 1}. {
                                                                        participant.name ||
                                                                        participant.full_name ||
                                                                        participant.participant_name ||
                                                                        "Participant"
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {
                                                                        participant.email ||
                                                                        participant.participant_email ||
                                                                        "-"
                                                                    }
                                                                </p>

                                                            </div>

                                                            {savingId === participantId ? (

                                                                <span className="shrink-0 h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />

                                                            ) : existingAttendance ? (

                                                                <span className="shrink-0 inline-flex items-center gap-1 text-xs text-green-600 font-medium">

                                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                                    Saved

                                                                </span>

                                                            ) : (

                                                                <span className="shrink-0 text-xs text-gray-400">
                                                                    Not marked
                                                                </span>

                                                            )}

                                                        </div>

                                                        <select
                                                            value={currentStatus}
                                                            onChange={(e) =>
                                                                saveAttendance(
                                                                    participant,
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={
                                                                savingId ===
                                                                participantId
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border font-semibold text-sm ${
                                                                currentStatus ===
                                                                "PRESENT"
                                                                    ? "border-green-300 bg-green-50 text-green-700"
                                                                    : "border-red-300 bg-red-50 text-red-700"
                                                            }`}
                                                        >

                                                            <option value="PRESENT">
                                                                PRESENT
                                                            </option>

                                                            <option value="ABSENT">
                                                                ABSENT
                                                            </option>

                                                        </select>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                </>

                            )}

                        </div>

                    )}

            </div>

        </div>
    );
}

export default AttendanceManagement;