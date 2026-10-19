import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";

import { getAllEvents } from "../services/eventService";
import { getFeedbackByEvent } from "../services/feedbackService";

function FeedbackManagement() {

    const token = sessionStorage.getItem("token");

    const [events, setEvents] = useState([]);
    const [feedback, setFeedback] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState("");

    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {

        try {

            setLoadingEvents(true);

            const result = await getAllEvents(token);

            if (result.status === "success") {
                setEvents(result.data);
            }

        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoadingEvents(false);
        }
    };

    const handleEventChange = async (eventId) => {

        setSelectedEvent(eventId);
        setFeedback([]);

        if (!eventId) {
            return;
        }

        try {

            setLoadingFeedback(true);

            const result = await getFeedbackByEvent(
                token,
                eventId
            );

            if (result.status === "success") {
                setFeedback(result.data);
            }

        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoadingFeedback(false);
        }
    };

    const renderStars = (rating) => {

        return (
            <div className="flex items-center gap-0.5">

                {[1, 2, 3, 4, 5].map((star) => (

                    <span
                        key={star}
                        className={
                            star <= Number(rating)
                                ? "text-yellow-500 text-lg leading-none"
                                : "text-gray-300 text-lg leading-none"
                        }
                    >
                        ★
                    </span>

                ))}

            </div>
        );
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

            <AdminNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

                {/* Header */}
                <div className="mb-8 animate-fade-up">

                    <div className="flex items-center gap-3 mb-2">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xl shadow-lg shadow-yellow-200">
                            ⭐
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            Feedback Management
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        View feedback submitted by event participants.
                    </p>

                </div>

                {/* Event Selection */}
                <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-6 mb-6 animate-fade-up">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Event
                    </label>

                    <select
                        value={selectedEvent}
                        onChange={(e) =>
                            handleEventChange(e.target.value)
                        }
                        disabled={loadingEvents}
                        className="w-full md:w-1/2 border border-gray-300 rounded-xl px-4 py-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                    >

                        <option value="">
                            {loadingEvents
                                ? "Loading events..."
                                : "Select Event"
                            }
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

                {/* Loading */}
                {loadingFeedback && (

                    <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg p-8 sm:p-12 text-center animate-fade-in">

                        <div className="mx-auto h-10 w-10 rounded-full border-4 border-yellow-200 border-t-yellow-500 animate-spin mb-4" />

                        <p className="text-gray-600">Loading feedback...</p>

                    </div>

                )}

                {/* No Event Selected */}
                {!loadingFeedback && !selectedEvent && (

                    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl shadow-lg p-8 sm:p-12 text-center animate-fade-up">

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 text-3xl">
                            ⭐
                        </div>

                        <p className="text-gray-500 text-sm sm:text-base">
                            Select an event to view its feedback.
                        </p>

                    </div>

                )}

                {/* Feedback */}
                {!loadingFeedback &&
                    selectedEvent &&
                    (

                        <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-up">

                            <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                                    Participant Feedback
                                </h2>

                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {feedback.length} feedback record(s)
                                </p>

                            </div>

                            {feedback.length === 0 ? (

                                <div className="p-8 sm:p-12 text-center">

                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 text-3xl animate-bounce">
                                        ⭐
                                    </div>

                                    <p className="text-gray-500 text-sm sm:text-base">
                                        No feedback has been submitted for this event.
                                    </p>

                                </div>

                            ) : (

                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden lg:block overflow-x-auto">

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
                                                        Session
                                                    </th>

                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                        Rating
                                                    </th>

                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                        Comment
                                                    </th>

                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                        Date
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody className="divide-y divide-gray-100">

                                                {feedback.map(
                                                    (item, index) => (

                                                        <tr
                                                            key={item.id || index}
                                                            className="hover:bg-yellow-50/50 transition-colors duration-200"
                                                        >

                                                            <td className="px-6 py-4 text-gray-600">
                                                                {index + 1}
                                                            </td>

                                                            <td className="px-6 py-4">

                                                                <p className="font-medium text-gray-800">
                                                                    {
                                                                        item.participant_name ||
                                                                        item.name ||
                                                                        "Participant"
                                                                    }
                                                                </p>

                                                                <p className="text-sm text-gray-500">
                                                                    {
                                                                        item.participant_email ||
                                                                        item.email ||
                                                                        "-"
                                                                    }
                                                                </p>

                                                            </td>

                                                            <td className="px-6 py-4 text-gray-700">
                                                                {
                                                                    item.session_name ||
                                                                    item.sessionName ||
                                                                    (
                                                                        item.session_id
                                                                            ? `Session #${item.session_id}`
                                                                            : "Event Feedback"
                                                                    )
                                                                }
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                {renderStars(item.rating)}
                                                            </td>

                                                            <td className="px-6 py-4 text-gray-600 max-w-md">
                                                                {item.comment || "No comment"}
                                                            </td>

                                                            <td className="px-6 py-4 text-gray-600">
                                                                {
                                                                    item.created_at
                                                                        ? new Date(item.created_at).toLocaleDateString()
                                                                        : "-"
                                                                }
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>


                                    {/* Mobile / Tablet Cards */}
                                    <div className="lg:hidden divide-y divide-gray-100">

                                        {feedback.map(
                                            (item, index) => (

                                                <div
                                                    key={item.id || index}
                                                    className="p-5 space-y-3"
                                                >

                                                    <div className="flex items-start justify-between gap-3">

                                                        <div className="min-w-0">

                                                            <p className="font-semibold text-slate-900">
                                                                {
                                                                    item.participant_name ||
                                                                    item.name ||
                                                                    "Participant"
                                                                }
                                                            </p>

                                                            <p className="text-xs text-gray-500 truncate">
                                                                {
                                                                    item.participant_email ||
                                                                    item.email ||
                                                                    "-"
                                                                }
                                                            </p>

                                                        </div>

                                                        {renderStars(item.rating)}

                                                    </div>

                                                    <p className="text-xs text-gray-500">
                                                        <span className="font-medium text-slate-700">Session: </span>
                                                        {
                                                            item.session_name ||
                                                            item.sessionName ||
                                                            (
                                                                item.session_id
                                                                    ? `Session #${item.session_id}`
                                                                    : "Event Feedback"
                                                            )
                                                        }
                                                    </p>

                                                    {item.comment && (
                                                        <p className="text-sm text-gray-600 leading-6">
                                                            {item.comment}
                                                        </p>
                                                    )}

                                                    {item.created_at && (
                                                        <p className="text-xs text-gray-400">
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </p>
                                                    )}

                                                </div>

                                            )
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

export default FeedbackManagement;