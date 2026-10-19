import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";
import {
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent
} from "../services/eventService";

function EventManagement() {

    const token = sessionStorage.getItem("token");

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        event_date: "",
        start_time: "",
        end_time: "",
        venue: "",
        status: "UPCOMING"
    });


    useEffect(() => {
        loadEvents();
    }, []);


    const loadEvents = async () => {

        try {

            setLoading(true);
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

            setLoading(false);

        }
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
            event_date: "",
            start_time: "",
            end_time: "",
            venue: "",
            status: "UPCOMING"
        });

        setEditingEvent(null);
        setShowForm(false);

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        try {

            let result;

            if (editingEvent) {

                result = await updateEvent(
                    token,
                    editingEvent.id,
                    formData
                );

            }
            else {

                result = await addEvent(
                    token,
                    formData
                );

            }

            if (result.status === "success") {

                setMessage(
                    editingEvent
                        ? "Event updated successfully"
                        : "Event added successfully"
                );

                resetForm();
                loadEvents();

            }
            else {

                setError(
                    result.message || "Operation failed"
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


    const handleEdit = (event) => {

        setEditingEvent(event);

        setFormData({
            name: event.name || "",
            description: event.description || "",
            event_date: event.event_date
                ? String(event.event_date).substring(0, 10)
                : "",
            start_time: event.start_time || "",
            end_time: event.end_time || "",
            venue: event.venue || "",
            status: event.status || "UPCOMING"
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const handleDelete = async (eventId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed)
            return;

        try {

            setError("");
            setMessage("");

            const result = await deleteEvent(
                token,
                eventId
            );

            if (result.status === "success") {

                setMessage(
                    "Event deleted successfully"
                );

                loadEvents();

            }
            else {

                setError(
                    result.message || "Unable to delete event"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete event"
            );

        }
    };


    const getStatusClass = (status) => {
        switch (status) {
            case "UPCOMING": return "bg-blue-100 text-blue-700 ring-blue-200";
            case "ONGOING": return "bg-green-100 text-green-700 ring-green-200";
            case "COMPLETED": return "bg-gray-100 text-gray-700 ring-gray-200";
            case "CANCELLED": return "bg-red-100 text-red-700 ring-red-200";
            default: return "bg-gray-100 text-gray-700 ring-gray-200";
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

                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl shadow-lg shadow-blue-200">
                                📅
                            </span>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                                Event Management
                            </h1>

                        </div>

                        <p className="text-gray-600 text-sm sm:text-base">
                            Create and manage events.
                        </p>

                    </div>

                    <button
                        onClick={() => {

                            if (showForm) {
                                resetForm();
                            }
                            else {
                                setEditingEvent(null);
                                setShowForm(true);
                            }

                        }}
                        className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98] transition-all duration-200"
                    >
                        {showForm
                            ? "Close Form"
                            : "+ Add Event"}
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


                {/* Add / Edit Form */}
                {showForm && (

                    <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-8 mb-8 animate-fade-up">

                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            {editingEvent
                                ? "Edit Event"
                                : "Add Event"}
                        </h2>


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Name */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Event Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="Enter event name"
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
                                    className={`${inputClass} resize-none`}
                                    placeholder="Enter event description"
                                />

                            </div>


                            {/* Date + Venue */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Event Date
                                    </label>

                                    <input
                                        type="date"
                                        name="event_date"
                                        value={formData.event_date}
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
                                        className={inputClass}
                                        placeholder="Enter venue"
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


                            {/* Status */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="UPCOMING">UPCOMING</option>
                                    <option value="ONGOING">ONGOING</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>

                            </div>


                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">

                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                                >
                                    {editingEvent
                                        ? "Update Event"
                                        : "Add Event"}
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


                {/* Events */}
                <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-up">

                    <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            All Events
                        </h2>

                    </div>


                    {loading ? (

                        <div className="p-10 text-center animate-pulse">

                            <div className="mx-auto h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />

                            <p className="text-gray-500">Loading events...</p>

                        </div>

                    ) : events.length === 0 ? (

                        <div className="p-10 sm:p-12 text-center">

                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 text-3xl animate-bounce">
                                📅
                            </div>

                            <p className="text-gray-500">No events found.</p>

                        </div>

                    ) : (

                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gradient-to-r from-slate-100 to-slate-50">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Event
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
                                                Status
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {events.map((event, index) => (

                                            <tr
                                                key={event.id}
                                                style={{ animationDelay: `${index * 40}ms` }}
                                                className="animate-fade-up border-t border-gray-100 hover:bg-blue-50/60 transition-colors duration-200"
                                            >

                                                <td className="px-6 py-4">

                                                    <p className="font-semibold text-slate-900">
                                                        {event.name}
                                                    </p>

                                                    {event.description && (
                                                        <p className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                                                            {event.description}
                                                        </p>
                                                    )}

                                                </td>


                                                <td className="px-6 py-4 text-gray-700">
                                                    {event.event_date
                                                        ? String(event.event_date).substring(0, 10)
                                                        : "-"}
                                                </td>


                                                <td className="px-6 py-4 text-gray-700">

                                                    {event.start_time || "-"}
                                                    {" - "}
                                                    {event.end_time || "-"}

                                                </td>


                                                <td className="px-6 py-4 text-gray-700">
                                                    {event.venue || "-"}
                                                </td>


                                                <td className="px-6 py-4">

                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${getStatusClass(event.status)}`}>
                                                        {event.status || "-"}
                                                    </span>

                                                </td>


                                                <td className="px-6 py-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() =>
                                                                handleEdit(event)
                                                            }
                                                            className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(event.id)
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

                                {events.map((event, index) => (

                                    <div
                                        key={event.id}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        className="animate-fade-up p-5 space-y-3"
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="min-w-0">

                                                <p className="font-semibold text-slate-900">
                                                    {event.name}
                                                </p>

                                                {event.description && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                )}

                                            </div>

                                            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${getStatusClass(event.status)}`}>
                                                {event.status || "-"}
                                            </span>

                                        </div>

                                        <div className="text-sm text-gray-600 space-y-1">

                                            <p>
                                                <span className="font-medium text-slate-700">Date: </span>
                                                {event.event_date ? String(event.event_date).substring(0, 10) : "-"}
                                            </p>

                                            <p>
                                                <span className="font-medium text-slate-700">Time: </span>
                                                {event.start_time || "-"} - {event.end_time || "-"}
                                            </p>

                                            <p>
                                                <span className="font-medium text-slate-700">Venue: </span>
                                                {event.venue || "-"}
                                            </p>

                                        </div>

                                        <div className="flex gap-2 pt-1">

                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="flex-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(event.id)}
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

export default EventManagement;