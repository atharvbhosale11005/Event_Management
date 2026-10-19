import { useEffect, useState } from "react";

import ParticipantNavbar from "../components/ParticipantNavbar";
import { getMyRegistrations } from "../services/registrationService";
import { getSessionsByEvent } from "../services/sessionService";
import {
    addFeedback,
    getMyFeedback
} from "../services/feedbackService";

function Feedback() {

    const [registrations, setRegistrations] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [feedback, setFeedback] = useState([]);

    const [eventId, setEventId] = useState("");
    const [sessionId, setSessionId] = useState("");

    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const token = sessionStorage.getItem("token");

            const [registrationResult, feedbackResult] =
                await Promise.all([
                    getMyRegistrations(token),
                    getMyFeedback(token)
                ]);

            if (registrationResult.status === "success") {

                const data = registrationResult.data || [];

                setRegistrations(data);

                if (data.length > 0) {

                    const firstEventId =
                        data[0].event_id ||
                        data[0].eventId;

                    if (firstEventId) {

                        setEventId(String(firstEventId));

                        loadSessions(firstEventId);
                    }
                }
            }
            else {

                setError(
                    registrationResult.message ||
                    "Unable to load registered events"
                );

            }


            if (feedbackResult.status === "success") {

                setFeedback(feedbackResult.data || []);

            }
            else {

                setError(
                    feedbackResult.message ||
                    "Unable to load feedback"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load feedback data"
            );

        }
        finally {

            setLoading(false);

        }
    };


    const loadSessions = async (selectedEventId) => {

        if (!selectedEventId) {
            setSessions([]);
            return;
        }

        try {

            setLoadingSessions(true);
            setError("");

            const token = sessionStorage.getItem("token");

            const result = await getSessionsByEvent(
                token,
                selectedEventId
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

        const selectedEventId = e.target.value;

        setEventId(selectedEventId);
        setSessionId("");

        if (selectedEventId) {
            loadSessions(selectedEventId);
        }
        else {
            setSessions([]);
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        if (!eventId) {
            setError("Please select an event");
            return;
        }

        if (!rating) {
            setError("Please select a rating");
            return;
        }

        try {

            setSubmitting(true);

            const token = sessionStorage.getItem("token");

            const feedbackData = {
                event_id: Number(eventId),
                session_id: sessionId
                    ? Number(sessionId)
                    : null,
                rating: Number(rating),
                comment
            };

            const result = await addFeedback(
                token,
                feedbackData
            );

            if (result.status === "success") {

                setMessage(
                    "Feedback submitted successfully."
                );

                setRating("");
                setComment("");
                setSessionId("");

                const feedbackResult =
                    await getMyFeedback(token);

                if (feedbackResult.status === "success") {
                    setFeedback(feedbackResult.data || []);
                }

            }
            else {

                setError(
                    result.message ||
                    "Unable to submit feedback"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to submit feedback"
            );

        }
        finally {

            setSubmitting(false);

        }
    };


    const inputClass =
        "w-full px-4 py-3 border border-gray-300 rounded-xl outline-none bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base";


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

            <ParticipantNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

                {/* Heading */}
                <div className="mb-8 animate-fade-up">

                    <div className="flex items-center gap-3 mb-2">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xl shadow-lg shadow-yellow-200">
                            ⭐
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            Feedback
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        Share your experience about events and sessions.
                    </p>

                </div>


                {/* Messages */}
                {error && (
                    <div className="animate-pop-in mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-sm flex items-start gap-3">
                        <span className="text-lg leading-none">⚠️</span>
                        <span className="text-sm sm:text-base">{error}</span>
                    </div>
                )}

                {message && (
                    <div className="animate-pop-in mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 shadow-sm flex items-start gap-3">
                        <span className="text-lg leading-none">✅</span>
                        <span className="text-sm sm:text-base">{message}</span>
                    </div>
                )}


                {/* Feedback Form */}
                <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6 sm:p-8 mb-10 animate-fade-up">

                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Submit Feedback
                    </h2>

                    {loading ? (

                        <div className="space-y-4 animate-pulse">
                            <div className="h-12 rounded-xl bg-slate-100" />
                            <div className="h-12 rounded-xl bg-slate-100" />
                            <div className="h-12 rounded-xl bg-slate-100" />
                            <div className="h-24 rounded-xl bg-slate-100" />
                        </div>

                    ) : registrations.length === 0 ? (

                        <p className="text-gray-500 text-sm sm:text-base">
                            You must be registered for an event before
                            submitting feedback.
                        </p>

                    ) : (

                        <form onSubmit={handleSubmit}>

                            {/* Event */}
                            <div className="mb-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Event
                                </label>

                                <select
                                    value={eventId}
                                    onChange={handleEventChange}
                                    className={inputClass}
                                >

                                    <option value="">
                                        Select Event
                                    </option>

                                    {registrations.map((registration) => {

                                        const id =
                                            registration.event_id ||
                                            registration.eventId;

                                        const name =
                                            registration.event_name ||
                                            registration.name ||
                                            "Event";

                                        return (
                                            <option
                                                key={id}
                                                value={id}
                                            >
                                                {name}
                                            </option>
                                        );

                                    })}

                                </select>

                            </div>


                            {/* Session */}
                            <div className="mb-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Session
                                </label>

                                <select
                                    value={sessionId}
                                    onChange={(e) =>
                                        setSessionId(e.target.value)
                                    }
                                    disabled={
                                        loadingSessions ||
                                        !eventId
                                    }
                                    className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >

                                    <option value="">
                                        Event Overall Feedback
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


                            {/* Rating */}
                            <div className="mb-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Rating
                                </label>

                                <select
                                    value={rating}
                                    onChange={(e) =>
                                        setRating(e.target.value)
                                    }
                                    className={inputClass}
                                >

                                    <option value="">
                                        Select Rating
                                    </option>

                                    <option value="5">
                                        ⭐⭐⭐⭐⭐ - Excellent
                                    </option>

                                    <option value="4">
                                        ⭐⭐⭐⭐ - Very Good
                                    </option>

                                    <option value="3">
                                        ⭐⭐⭐ - Good
                                    </option>

                                    <option value="2">
                                        ⭐⭐ - Fair
                                    </option>

                                    <option value="1">
                                        ⭐ - Poor
                                    </option>

                                </select>

                            </div>


                            {/* Comment */}
                            <div className="mb-6">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Comment
                                </label>

                                <textarea
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(e.target.value)
                                    }
                                    rows="4"
                                    placeholder="Share your feedback..."
                                    className={`${inputClass} resize-none`}
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Feedback"}
                            </button>

                        </form>

                    )}

                </div>


                {/* Previous Feedback */}
                <div>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                        My Previous Feedback
                    </h2>

                    {feedback.length === 0 ? (

                        <div className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl p-10 text-center shadow-lg animate-fade-up">

                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 text-4xl animate-bounce">
                                ⭐
                            </div>

                            <p className="text-gray-500 text-sm sm:text-base">
                                You have not submitted any feedback yet.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {feedback.map((item, index) => (

                                <div
                                    key={item.id}
                                    style={{ animationDelay: `${index * 70}ms` }}
                                    className="animate-fade-up bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6"
                                >

                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {item.event_name || "Event"}
                                    </h3>

                                    {item.session_name && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Session: {item.session_name}
                                        </p>
                                    )}

                                    <div className="mt-4 text-yellow-500 text-lg tracking-wider">
                                        {"⭐".repeat(Number(item.rating))}
                                    </div>

                                    {item.comment && (
                                        <p className="text-gray-600 mt-4 text-sm sm:text-base leading-6">
                                            {item.comment}
                                        </p>
                                    )}

                                    {item.created_at && (
                                        <p className="text-xs text-gray-400 mt-4">
                                            {item.created_at}
                                        </p>
                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default Feedback;