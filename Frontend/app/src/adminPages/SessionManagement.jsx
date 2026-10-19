import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";
import {
    getAllEvents
} from "../services/eventService";

import {
    getSessionsByEvent,
    addSession,
    updateSession,
    deleteSession
} from "../services/sessionService";


function SessionManagement() {

    const token = sessionStorage.getItem("token");

    const [events, setEvents] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState("");

    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        session_date: "",
        start_time: "",
        end_time: "",
        venue: ""
    });


    useEffect(() => {
        loadEvents();
    }, []);


    const loadEvents = async () => {

        try {

            setLoadingEvents(true);
            setError("");

            const result = await getAllEvents(token);

            if (result.status === "success") {

                setEvents(result.data || []);

            }
            else {

                setError(
                    result.message || "Unable to load events"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load events"
            );

        }
        finally {

            setLoadingEvents(false);

        }
    };


    const loadSessions = async (eventId) => {

        if (!eventId) {

            setSessions([]);
            return;

        }

        try {

            setLoadingSessions(true);
            setError("");

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

        setMessage("");
        setError("");

        setShowForm(false);
        setEditingSession(null);

        loadSessions(eventId);

    };


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const resetForm = () => {

        setFormData({
            name: "",
            description: "",
            session_date: "",
            start_time: "",
            end_time: "",
            venue: ""
        });

        setEditingSession(null);
        setShowForm(false);

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!selectedEvent) {

            setError("Please select an event first");
            return;

        }

        try {

            setError("");
            setMessage("");

            let result;

            const sessionData = {
                ...formData,
                event_id: Number(selectedEvent)
            };


            if (editingSession) {

                result = await updateSession(
                    token,
                    editingSession.id,
                    sessionData
                );

            }
            else {

                result = await addSession(
                    token,
                    sessionData
                );

            }


            if (result.status === "success") {

                setMessage(
                    editingSession
                        ? "Session updated successfully"
                        : "Session added successfully"
                );

                resetForm();

                loadSessions(selectedEvent);

            }
            else {

                setError(
                    result.message ||
                    "Operation failed"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Operation failed"
            );

        }
    };


    const handleEdit = (session) => {

        setEditingSession(session);

        setFormData({
            name: session.name || "",
            description: session.description || "",
            session_date: session.session_date
                ? String(session.session_date).substring(0, 10)
                : "",
            start_time: session.start_time || "",
            end_time: session.end_time || "",
            venue: session.venue || ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const handleDelete = async (sessionId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this session?"
        );

        if (!confirmed)
            return;

        try {

            setError("");
            setMessage("");

            const result = await deleteSession(
                token,
                sessionId
            );

            if (result.status === "success") {

                setMessage(
                    "Session deleted successfully"
                );

                loadSessions(selectedEvent);

            }
            else {

                setError(
                    result.message ||
                    "Unable to delete session"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete session"
            );

        }
    };


    const inputClass =
        "w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base";


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
                @keyframes popIn {
                    0%   { opacity: 0; transform: scale(0.96); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-fade-up { animation: fadeUp 0.5s ease-out both; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out both; }
                .animate-pop-in  { animation: popIn 0.35s ease-out both; }
            `}</style>

            <AdminNavbar />


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">


                {/* Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-up">

                    <div>

                        <div className="flex items-center gap-3 mb-2">

                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xl shadow-lg shadow-purple-200">
                                🎯
                            </span>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                                Session Management
                            </h1>

                        </div>

                        <p className="text-gray-600 text-sm sm:text-base">
                            Create and manage sessions for events.
                        </p>

                    </div>


                    <button
                        onClick={() => {

                            if (!selectedEvent) {

                                setError(
                                    "Please select an event first"
                                );

                                return;

                            }

                            if (showForm) {

                                resetForm();

                            }
                            else {

                                setEditingSession(null);

                                setFormData({
                                    name: "",
                                    description: "",
                                    session_date: "",
                                    start_time: "",
                                    end_time: "",
                                    venue: ""
                                });

                                setShowForm(true);

                            }

                        }}
                        className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-purple-200 hover:shadow-xl active:scale-[0.98] transition-all duration-200"
                    >

                        {showForm
                            ? "Close Form"
                            : "+ Add Session"}

                    </button>

                </div>


                {/* Messages */}

                {message && (
                    <div className="animate-pop-in mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 shadow-sm flex items-start gap-3">
                        <span className="text-lg leading-none">✅</span>
                        <span className="text-sm sm:text-base">{message}</span>
                    </div>
                )}


                {error && (
                    <div className="animate-pop-in mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-sm flex items-start gap-3">
                        <span className="text-lg leading-none">⚠️</span>
                        <span className="text-sm sm:text-base">{error}</span>
                    </div>
                )}


                {/* Event Selection */}

                <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-6 mb-8 animate-fade-up">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Event
                    </label>


                    <select
                        value={selectedEvent}
                        onChange={handleEventChange}
                        disabled={loadingEvents}
                        className="w-full md:w-2/3 px-4 py-3 border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                    >

                        <option value="">
                            {loadingEvents
                                ? "Loading events..."
                                : "Select an event"}
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


                {/* Add / Edit Form */}

                {showForm && selectedEvent && (

                    <div className="animate-fade-up bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-8 mb-8">

                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">

                            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />

                            {editingSession
                                ? "Edit Session"
                                : "Add Session"}

                        </h2>


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >


                            {/* Session Name */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Session Name
                                </label>


                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter session name"
                                    className={inputClass}
                                />

                            </div>


                            {/* Description */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>


                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter session description"
                                    className={`${inputClass} resize-none`}
                                />

                            </div>


                            {/* Date + Venue */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Session Date
                                    </label>


                                    <input
                                        type="date"
                                        name="session_date"
                                        value={formData.session_date}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />

                                </div>


                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Venue
                                    </label>


                                    <input
                                        type="text"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter venue"
                                        className={inputClass}
                                    />

                                </div>

                            </div>


                            {/* Time */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Start Time
                                    </label>


                                    <input
                                        type="time"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />

                                </div>


                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        End Time
                                    </label>


                                    <input
                                        type="time"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />

                                </div>

                            </div>


                            {/* Buttons */}

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">

                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                                >

                                    {editingSession
                                        ? "Update Session"
                                        : "Add Session"}

                                </button>


                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold active:scale-[0.98] transition-all duration-200"
                                >

                                    Cancel

                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* Sessions */}

                <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-up">


                    <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                            Sessions
                        </h2>

                    </div>


                    {!selectedEvent ? (

                        <div className="p-10 sm:p-12 text-center">

                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-violet-200 text-3xl">
                                🎯
                            </div>

                            <p className="text-gray-500 text-sm sm:text-base">
                                Select an event to view its sessions.
                            </p>

                        </div>

                    ) : loadingSessions ? (

                        <div className="p-10 text-center animate-pulse">

                            <div className="mx-auto h-10 w-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mb-4" />

                            <p className="text-gray-500">Loading sessions...</p>

                        </div>

                    ) : sessions.length === 0 ? (

                        <div className="p-10 sm:p-12 text-center">

                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-violet-200 text-3xl animate-bounce">
                                🎯
                            </div>

                            <p className="text-gray-500 text-sm sm:text-base">
                                No sessions found for this event.
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
                                                Session
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Date
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Time
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Venue
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {sessions.map((session, index) => (

                                            <tr
                                                key={session.id}
                                                style={{ animationDelay: `${index * 40}ms` }}
                                                className="animate-fade-up border-t border-gray-100 hover:bg-purple-50/50 transition-colors duration-200"
                                            >


                                                <td className="px-6 py-4">

                                                    <p className="font-semibold text-slate-900">
                                                        {session.name}
                                                    </p>


                                                    {session.description && (

                                                        <p className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                                                            {session.description}
                                                        </p>

                                                    )}

                                                </td>


                                                <td className="px-6 py-4 text-gray-700">
                                                    {session.session_date
                                                        ? String(session.session_date).substring(0, 10)
                                                        : "-"}
                                                </td>


                                                <td className="px-6 py-4 text-gray-700">
                                                    {session.start_time || "-"}
                                                    {" - "}
                                                    {session.end_time || "-"}
                                                </td>


                                                <td className="px-6 py-4 text-gray-700">
                                                    {session.venue || "-"}
                                                </td>


                                                <td className="px-6 py-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => handleEdit(session)}
                                                            className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            onClick={() => handleDelete(session.id)}
                                                            className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>


                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-gray-100">

                                {sessions.map((session, index) => (

                                    <div
                                        key={session.id}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        className="animate-fade-up p-5 space-y-3"
                                    >

                                        <div className="flex items-start gap-3">

                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-violet-200 text-purple-600">
                                                🎯
                                            </span>

                                            <div className="min-w-0">

                                                <p className="font-semibold text-slate-900">
                                                    {session.name}
                                                </p>

                                                {session.description && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {session.description}
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                        <div className="text-sm text-gray-600 space-y-1">

                                            <p>
                                                <span className="font-medium text-slate-700">Date: </span>
                                                {session.session_date ? String(session.session_date).substring(0, 10) : "-"}
                                            </p>

                                            <p>
                                                <span className="font-medium text-slate-700">Time: </span>
                                                {session.start_time || "-"} - {session.end_time || "-"}
                                            </p>

                                            <p>
                                                <span className="font-medium text-slate-700">Venue: </span>
                                                {session.venue || "-"}
                                            </p>

                                        </div>

                                        <div className="flex gap-2 pt-1">

                                            <button
                                                onClick={() => handleEdit(session)}
                                                className="flex-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(session.id)}
                                                className="flex-1 px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        </>

                    )}

                </div>

            </main>

        </div>

    );
}

export default SessionManagement;