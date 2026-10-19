import { useEffect, useState } from "react";

import ParticipantNavbar from "../components/ParticipantNavbar";
import { getMyRegistrations } from "../services/registrationService";
import { getSessionsByEvent } from "../services/sessionService";

function Sessions() {

    const [registrations, setRegistrations] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState("");

    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        loadRegistrations();
    }, []);

    const loadRegistrations = async () => {

        try {

            setLoadingEvents(true);
            setError("");

            const token = sessionStorage.getItem("token");

            const result = await getMyRegistrations(token);

            if (result.status === "success") {

                const data = result.data || [];

                setRegistrations(data);

                if (data.length > 0) {

                    const eventId =
                        data[0].event_id ||
                        data[0].eventId;

                    if (eventId) {
                        setSelectedEvent(String(eventId));
                        loadSessions(eventId);
                    }
                }

            }
            else {

                setError(
                    result.message ||
                    "Unable to load registered events"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load registered events"
            );

        }
        finally {

            setLoadingEvents(false);

        }
    };


    const loadSessions = async (eventId) => {

        if (!eventId) {
            return;
        }

        try {

            setLoadingSessions(true);
            setError("");

            const token = sessionStorage.getItem("token");

            const result = await getSessionsByEvent(
                token,
                eventId
            );

            if (result.status === "success") {

                setSessions(result.data || []);

            }
            else {

                setSessions([]);

                setError(
                    result.message ||
                    "Unable to load sessions"
                );

            }

        }
        catch (err) {

            console.log(err);

            setSessions([]);

            setError(
                err.response?.data?.message ||
                "Unable to load sessions"
            );

        }
        finally {

            setLoadingSessions(false);

        }
    };


    const handleEventChange = (e) => {

        const eventId = e.target.value;

        setSelectedEvent(eventId);

        if (eventId) {
            loadSessions(eventId);
        }
        else {
            setSessions([]);
        }
    };


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

            <ParticipantNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

                {/* Heading */}
                <div className="mb-8 animate-fade-up">

                    <div className="flex items-center gap-3 mb-2">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xl shadow-lg shadow-purple-200">
                            🎯
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            Sessions
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        View sessions for your registered events.
                    </p>

                </div>


                {/* Error */}
                {error && (
                    <div className="animate-fade-in mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-sm flex items-start gap-3">
                        <span className="text-lg leading-none">⚠️</span>
                        <span className="text-sm sm:text-base">{error}</span>
                    </div>
                )}


                {/* Event Selection */}
                <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-6 mb-8 animate-fade-up">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Event
                    </label>

                    {loadingEvents ? (

                        <div className="h-12 w-full md:w-1/2 rounded-xl bg-slate-100 animate-pulse" />

                    ) : registrations.length === 0 ? (

                        <div className="text-gray-500 text-sm sm:text-base">
                            You have not registered for any event.
                        </div>

                    ) : (

                        <select
                            value={selectedEvent}
                            onChange={handleEventChange}
                            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-xl outline-none bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                        >

                            {registrations.map((registration) => {

                                const eventId =
                                    registration.event_id ||
                                    registration.eventId;

                                const eventName =
                                    registration.event_name ||
                                    registration.name ||
                                    "Event";

                                return (
                                    <option
                                        key={eventId}
                                        value={eventId}
                                    >
                                        {eventName}
                                    </option>
                                );

                            })}

                        </select>

                    )}

                </div>


                {/* Sessions */}
                {loadingSessions ? (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">

                        {[1, 2, 3].map((card) => (

                            <div
                                key={card}
                                className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl shadow-md p-6 animate-pulse space-y-4"
                            >
                                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                                <div className="h-5 w-2/3 rounded bg-slate-200" />
                                <div className="h-3 w-full rounded bg-slate-200" />
                                <div className="h-3 w-5/6 rounded bg-slate-200" />
                            </div>

                        ))}

                    </div>

                ) : selectedEvent && sessions.length === 0 ? (

                    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl p-10 sm:p-14 text-center shadow-lg animate-fade-up">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-violet-200 text-4xl animate-bounce">
                            🎯
                        </div>

                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                            No Sessions
                        </h2>

                        <p className="text-gray-500 mt-2 text-sm sm:text-base">
                            No sessions are available for this event.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {sessions.map((session, index) => (

                            <div
                                key={session.id}
                                style={{ animationDelay: `${index * 70}ms` }}
                                className="animate-fade-up group bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-6 flex flex-col"
                            >

                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-violet-200 text-purple-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    🎯
                                </div>


                                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                                    {session.name}
                                </h2>


                                <p className="text-gray-600 text-sm mb-5 leading-6">
                                    {session.description ||
                                        "No description available."}
                                </p>


                                <div className="space-y-3 text-sm text-gray-600 mt-auto">

                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs">📅</span>
                                        <span>
                                            {session.session_date}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs">🕐</span>
                                        <span>
                                            {session.start_time}
                                            {" - "}
                                            {session.end_time}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-xs">📍</span>
                                        <span>
                                            {session.venue}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Sessions;