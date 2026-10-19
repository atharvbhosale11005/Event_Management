import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";

import {
    getAllSpeakers,
    addSpeaker,
    updateSpeaker,
    deleteSpeaker,
    assignSpeaker,
    getSessionSpeakers,
    removeSpeaker
} from "../services/speakerService";

import {
    getAllEvents
} from "../services/eventService";

import {
    getSessionsByEvent
} from "../services/sessionService";


function SpeakerManagement() {

    const token = sessionStorage.getItem("token");

    const [speakers, setSpeakers] = useState([]);
    const [events, setEvents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [assignedSpeakers, setAssignedSpeakers] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedSession, setSelectedSession] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [loadingAssigned, setLoadingAssigned] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingSpeaker, setEditingSpeaker] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        organization: ""
    });


    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [speakerResult, eventResult] =
                await Promise.all([
                    getAllSpeakers(token),
                    getAllEvents(token)
                ]);

            if (speakerResult.status === "success") {

                setSpeakers(speakerResult.data || []);

            }
            else {

                setError(
                    speakerResult.message ||
                    "Unable to load speakers"
                );

            }

            if (eventResult.status === "success") {

                setEvents(eventResult.data || []);

            }
            else {

                setError(
                    eventResult.message ||
                    "Unable to load events"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load data"
            );

        }
        finally {

            setLoading(false);

        }
    };


    const loadSessions = async (eventId) => {

        if (!eventId) {

            setSessions([]);
            setSelectedSession("");
            setAssignedSpeakers([]);

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


    const loadAssignedSpeakers = async (sessionId) => {

        if (!sessionId) {

            setAssignedSpeakers([]);
            return;

        }

        try {

            setLoadingAssigned(true);
            setError("");

            const result = await getSessionSpeakers(
                token,
                sessionId
            );

            if (result.status === "success") {

                setAssignedSpeakers(
                    result.data || []
                );

            }
            else {

                setAssignedSpeakers([]);

                setError(
                    result.message ||
                    "Unable to load assigned speakers"
                );

            }

        }
        catch (err) {

            console.log(err);

            setAssignedSpeakers([]);

            setError(
                err.response?.data?.message ||
                "Unable to load assigned speakers"
            );

        }
        finally {

            setLoadingAssigned(false);

        }
    };


    const handleEventChange = (e) => {

        const eventId = e.target.value;

        setSelectedEvent(eventId);
        setSelectedSession("");
        setAssignedSpeakers([]);

        setMessage("");
        setError("");

        loadSessions(eventId);

    };


    const handleSessionChange = (e) => {

        const sessionId = e.target.value;

        setSelectedSession(sessionId);

        setMessage("");
        setError("");

        loadAssignedSpeakers(sessionId);

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
            email: "",
            phone: "",
            bio: "",
            organization: ""
        });

        setEditingSpeaker(null);
        setShowForm(false);

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setMessage("");

            let result;

            if (editingSpeaker) {

                result = await updateSpeaker(
                    token,
                    editingSpeaker.id,
                    formData
                );

            }
            else {

                result = await addSpeaker(
                    token,
                    formData
                );

            }


            if (result.status === "success") {

                setMessage(
                    editingSpeaker
                        ? "Speaker updated successfully"
                        : "Speaker added successfully"
                );

                resetForm();

                const result =
                    await getAllSpeakers(token);

                if (result.status === "success") {

                    setSpeakers(result.data || []);

                }

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


    const handleEdit = (speaker) => {

        setEditingSpeaker(speaker);

        setFormData({
            name: speaker.name || "",
            email: speaker.email || "",
            phone: speaker.phone || "",
            bio: speaker.bio || "",
            organization: speaker.organization || ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const handleDelete = async (speakerId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this speaker?"
        );

        if (!confirmed)
            return;

        try {

            setError("");
            setMessage("");

            const result = await deleteSpeaker(
                token,
                speakerId
            );

            if (result.status === "success") {

                setMessage(
                    "Speaker deleted successfully"
                );

                const speakerResult =
                    await getAllSpeakers(token);

                if (speakerResult.status === "success") {

                    setSpeakers(
                        speakerResult.data || []
                    );

                }

                if (selectedSession) {
                    loadAssignedSpeakers(
                        selectedSession
                    );
                }

            }
            else {

                setError(
                    result.message ||
                    "Unable to delete speaker"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete speaker"
            );

        }
    };


    const handleAssign = async (speakerId) => {

        if (!selectedSession) {

            setError(
                "Please select a session first"
            );

            return;

        }

        try {

            setError("");
            setMessage("");

            const result = await assignSpeaker(
                token,
                selectedSession,
                speakerId
            );

            if (result.status === "success") {

                setMessage(
                    "Speaker assigned successfully"
                );

                loadAssignedSpeakers(
                    selectedSession
                );

            }
            else {

                setError(
                    result.message ||
                    "Unable to assign speaker"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to assign speaker"
            );

        }
    };


    const handleRemove = async (speakerId) => {

        if (!selectedSession)
            return;

        const confirmed = window.confirm(
            "Remove this speaker from the session?"
        );

        if (!confirmed)
            return;

        try {

            setError("");
            setMessage("");

            const result = await removeSpeaker(
                token,
                selectedSession,
                speakerId
            );

            if (result.status === "success") {

                setMessage(
                    "Speaker removed from session"
                );

                loadAssignedSpeakers(
                    selectedSession
                );

            }
            else {

                setError(
                    result.message ||
                    "Unable to remove speaker"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to remove speaker"
            );

        }
    };


    const isAssigned = (speakerId) => {

        return assignedSpeakers.some(
            (speaker) =>
                Number(speaker.id) === Number(speakerId)
        );

    };


    const inputClass =
        "w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base";

    const selectClass =
        "w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base";


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

                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xl shadow-lg shadow-orange-200">
                                🎤
                            </span>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                                Speaker Management
                            </h1>

                        </div>

                        <p className="text-gray-600 text-sm sm:text-base">
                            Manage speakers and assign them to sessions.
                        </p>

                    </div>


                    <button
                        onClick={() => {

                            if (showForm) {

                                resetForm();

                            }
                            else {

                                setEditingSpeaker(null);

                                setFormData({
                                    name: "",
                                    email: "",
                                    phone: "",
                                    bio: "",
                                    organization: ""
                                });

                                setShowForm(true);

                            }

                        }}
                        className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl active:scale-[0.98] transition-all duration-200"
                    >

                        {showForm
                            ? "Close Form"
                            : "+ Add Speaker"}

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


                {/* Add / Edit Speaker */}

                {showForm && (

                    <div className="animate-fade-up bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-8 mb-8">

                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                            {editingSpeaker
                                ? "Edit Speaker"
                                : "Add Speaker"}
                        </h2>


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >


                            {/* Name */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter speaker name"
                                    className={inputClass}
                                />

                            </div>


                            {/* Email + Phone */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                        className={inputClass}
                                    />

                                </div>


                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone"
                                        className={inputClass}
                                    />

                                </div>

                            </div>


                            {/* Organization */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Organization
                                </label>

                                <input
                                    type="text"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    placeholder="Enter organization"
                                    className={inputClass}
                                />

                            </div>


                            {/* Bio */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Bio
                                </label>

                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter speaker bio"
                                    className={`${inputClass} resize-none`}
                                />

                            </div>


                            {/* Buttons */}

                            <div className="flex flex-col sm:flex-row gap-3">

                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                                >

                                    {editingSpeaker
                                        ? "Update Speaker"
                                        : "Add Speaker"}

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


                {/* Assignment Selection */}

                <div className="animate-fade-up bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-8 mb-8">

                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                        Assign Speakers
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        {/* Event */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Event
                            </label>

                            <select
                                value={selectedEvent}
                                onChange={handleEventChange}
                                className={selectClass}
                            >

                                <option value="">
                                    Select an event
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
                                onChange={handleSessionChange}
                                disabled={
                                    !selectedEvent ||
                                    loadingSessions
                                }
                                className={selectClass}
                            >

                                <option value="">

                                    {!selectedEvent
                                        ? "Select event first"
                                        : loadingSessions
                                            ? "Loading sessions..."
                                            : "Select a session"}

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


                    {/* Assigned Speakers */}

                    {selectedSession && (

                        <div className="mt-6">

                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                Assigned Speakers
                            </h3>


                            {loadingAssigned ? (

                                <div className="py-4 text-center animate-pulse">

                                    <div className="mx-auto h-8 w-8 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin mb-2" />

                                    <p className="text-gray-500 text-sm">
                                        Loading assigned speakers...
                                    </p>

                                </div>

                            ) : assignedSpeakers.length === 0 ? (

                                <p className="text-gray-500 text-sm">
                                    No speakers assigned to this session.
                                </p>

                            ) : (

                                <div className="flex flex-wrap gap-3">

                                    {assignedSpeakers.map(
                                        (speaker) => (

                                            <div
                                                key={speaker.id}
                                                className="animate-pop-in flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                                            >

                                                <div>

                                                    <p className="font-medium text-slate-900 text-sm">
                                                        {speaker.name}
                                                    </p>

                                                    {speaker.organization && (

                                                        <p className="text-xs text-gray-500">
                                                            {speaker.organization}
                                                        </p>

                                                    )}

                                                </div>


                                                <button
                                                    onClick={() =>
                                                        handleRemove(
                                                            speaker.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 text-sm font-semibold active:scale-95 transition-all duration-200"
                                                >

                                                    Remove

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    )}

                </div>


                {/* Speaker List */}

                <div className="animate-fade-up bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">

                    <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                            All Speakers
                        </h2>

                    </div>


                    {loading ? (

                        <div className="p-10 text-center animate-pulse">

                            <div className="mx-auto h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin mb-4" />

                            <p className="text-gray-500">Loading speakers...</p>

                        </div>

                    ) : speakers.length === 0 ? (

                        <div className="p-10 sm:p-12 text-center">

                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-200 text-3xl animate-bounce">
                                🎤
                            </div>

                            <p className="text-gray-500">No speakers found.</p>

                        </div>

                    ) : (

                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gradient-to-r from-slate-100 to-slate-50">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Name
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Email
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Phone
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Organization
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {speakers.map((speaker, index) => (

                                            <tr
                                                key={speaker.id}
                                                style={{ animationDelay: `${index * 40}ms` }}
                                                className="animate-fade-up border-t border-gray-100 hover:bg-orange-50/50 transition-colors duration-200"
                                            >

                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-900">
                                                        {speaker.name}
                                                    </p>
                                                </td>


                                                <td className="px-6 py-4 text-gray-700">
                                                    {speaker.email || "-"}
                                                </td>


                                                <td className="px-6 py-4 text-gray-700">
                                                    {speaker.phone || "-"}
                                                </td>


                                                <td className="px-6 py-4 text-gray-700">
                                                    {speaker.organization || "-"}
                                                </td>


                                                <td className="px-6 py-4">

                                                    <div className="flex flex-wrap gap-2">


                                                        {selectedSession && (

                                                            <button
                                                                onClick={() =>
                                                                    handleAssign(
                                                                        speaker.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    isAssigned(
                                                                        speaker.id
                                                                    )
                                                                }
                                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                    isAssigned(
                                                                        speaker.id
                                                                    )
                                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                        : "bg-green-100 text-green-700 hover:bg-green-200 active:scale-95"
                                                                }`}
                                                            >

                                                                {isAssigned(
                                                                    speaker.id
                                                                )
                                                                    ? "Assigned"
                                                                    : "Assign"}

                                                            </button>

                                                        )}


                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    speaker
                                                                )
                                                            }
                                                            className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                                        >

                                                            Edit

                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    speaker.id
                                                                )
                                                            }
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

                                {speakers.map((speaker, index) => (

                                    <div
                                        key={speaker.id}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        className="animate-fade-up p-5 space-y-3"
                                    >

                                        <div className="flex items-start gap-3">

                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 text-orange-600">
                                                🎤
                                            </span>

                                            <div className="min-w-0">

                                                <p className="font-semibold text-slate-900">
                                                    {speaker.name}
                                                </p>

                                                {speaker.organization && (
                                                    <p className="text-xs text-gray-500">
                                                        {speaker.organization}
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                        <div className="text-sm text-gray-600 space-y-1">

                                            <p className="truncate">
                                                <span className="font-medium text-slate-700">Email: </span>
                                                {speaker.email || "-"}
                                            </p>

                                            <p>
                                                <span className="font-medium text-slate-700">Phone: </span>
                                                {speaker.phone || "-"}
                                            </p>

                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-1">

                                            {selectedSession && (

                                                <button
                                                    onClick={() =>
                                                        handleAssign(
                                                            speaker.id
                                                        )
                                                    }
                                                    disabled={
                                                        isAssigned(
                                                            speaker.id
                                                        )
                                                    }
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                        isAssigned(
                                                            speaker.id
                                                        )
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-green-100 text-green-700 hover:bg-green-200 active:scale-95"
                                                    }`}
                                                >

                                                    {isAssigned(
                                                        speaker.id
                                                    )
                                                        ? "Assigned"
                                                        : "Assign"}

                                                </button>

                                            )}


                                            <button
                                                onClick={() =>
                                                    handleEdit(speaker)
                                                }
                                                className="flex-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleDelete(speaker.id)
                                                }
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

export default SpeakerManagement;