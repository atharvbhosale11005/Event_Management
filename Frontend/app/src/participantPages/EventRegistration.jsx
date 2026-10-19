import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ParticipantNavbar from "../components/ParticipantNavbar";

import { getEventById } from "../services/eventService";
import { registerForEvent } from "../services/registrationService";

function EventRegistration() {

    const { eventId } = useParams();

    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");

    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadEvent();
    }, [eventId]);

    const loadEvent = async () => {

        try {

            const result = await getEventById(
                token,
                eventId
            );

            if (result.status === "success") {
                setEvent(result.data);
            }
            else {
                setError(result.message);
            }

        }
        catch (err) {
            console.log(err);
            setError("Unable to load event");
        }
        finally {
            setLoading(false);
        }
    };

    const handleRegistration = async () => {

        setMessage("");
        setError("");

        try {

            setRegistering(true);

            const result = await registerForEvent(
                token,
                Number(eventId)
            );

            if (result.status === "success") {

                setMessage(
                    "Event registration successful."
                );

                setTimeout(() => {
                    navigate("/participant/dashboard");
                }, 1200);

            }
            else {

                setError(
                    result.message ||
                    "Event registration failed."
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to register for the event."
            );

        }
        finally {
            setRegistering(false);
        }
    };

    if (loading) {

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

                <ParticipantNavbar />

                <div className="max-w-3xl mx-auto p-4 sm:p-6">

                    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 animate-pulse space-y-5">

                        <div className="h-6 w-1/2 rounded bg-slate-200" />
                        <div className="h-4 w-3/4 rounded bg-slate-200" />
                        <div className="h-32 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />

                    </div>

                </div>

            </div>
        );
    }

    if (!event) {

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

                <ParticipantNavbar />

                <div className="p-8 sm:p-16 text-center">

                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
                        🔍
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Event not found
                    </h2>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    0%   { opacity: 0; transform: scale(0.96); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-fade-up { animation: fadeUp 0.5s ease-out both; }
                .animate-pop-in  { animation: popIn 0.35s ease-out both; }
            `}</style>

            <ParticipantNavbar />

            <div className="max-w-3xl mx-auto p-4 sm:p-6">

                <div className="bg-white/90 backdrop-blur rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 p-6 sm:p-10 border border-white/60 animate-fade-up">

                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-2">
                        Event Registration
                    </h1>

                    <p className="text-gray-500 mb-8 text-sm sm:text-base">
                        Confirm your registration for this event.
                    </p>

                    {/* Event */}
                    <div className="border border-gray-200/80 rounded-2xl p-6 mb-6 bg-gradient-to-br from-white to-slate-50">

                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            {event.name}
                        </h2>

                        <p className="text-gray-600 mt-4 text-sm sm:text-base leading-7">
                            {event.description}
                        </p>

                        <div className="mt-5 space-y-2 text-gray-600 text-sm sm:text-base">

                            <p>
                                <strong className="text-slate-800">Date:</strong>{" "}
                                {event.event_date
                                    ? new Date(
                                        event.event_date
                                    ).toLocaleDateString()
                                    : "-"}
                            </p>

                            <p>
                                <strong className="text-slate-800">Time:</strong>{" "}
                                {event.start_time} -{" "}
                                {event.end_time}
                            </p>

                            <p>
                                <strong className="text-slate-800">Venue:</strong>{" "}
                                {event.venue}
                            </p>

                        </div>

                    </div>

                    {/* Success */}
                    {message && (

                        <div className="animate-pop-in bg-green-50 text-green-700 border border-green-200 rounded-xl p-4 mb-5 flex items-start gap-3 shadow-sm">
                            <span className="text-lg leading-none">✅</span>
                            <span className="text-sm sm:text-base">{message}</span>
                        </div>

                    )}

                    {/* Error */}
                    {error && (

                        <div className="animate-pop-in bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3 shadow-sm">
                            <span className="text-lg leading-none">⚠️</span>
                            <span className="text-sm sm:text-base">{error}</span>
                        </div>

                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">

                        <button
                            onClick={() =>
                                navigate(
                                    `/participant/events/${eventId}`
                                )
                            }
                            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all duration-200"
                        >
                            Back
                        </button>

                        <button
                            onClick={handleRegistration}
                            disabled={registering}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200"
                        >
                            {registering
                                ? "Registering..."
                                : "Confirm Registration"
                            }
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EventRegistration;