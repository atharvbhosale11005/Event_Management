import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ParticipantNavbar from "../components/ParticipantNavbar";
import { getEventById } from "../services/eventService";

function EventDetails() {

    const { eventId } = useParams();
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

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

        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    if (loading) {

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

                <ParticipantNavbar />

                <div className="max-w-5xl mx-auto p-4 sm:p-6">

                    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg overflow-hidden animate-pulse">

                        <div className="h-40 bg-gradient-to-r from-blue-200 to-indigo-200" />

                        <div className="p-6 sm:p-8 space-y-4">

                            <div className="h-4 w-3/4 rounded bg-slate-200" />
                            <div className="h-4 w-1/2 rounded bg-slate-200" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="h-20 rounded-xl bg-slate-100" />
                                <div className="h-20 rounded-xl bg-slate-100" />
                                <div className="h-20 rounded-xl bg-slate-100" />
                                <div className="h-20 rounded-xl bg-slate-100" />
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    if (!event) {

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

                <ParticipantNavbar />

                <div className="p-8 sm:p-16 text-center animate-fade-in">

                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
                        🔍
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Event Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        The event you're looking for doesn't exist or was removed.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/participant/events")
                        }
                        className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all duration-200"
                    >
                        Back to Events
                    </button>

                </div>

            </div>
        );
    }

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
                @keyframes floatBlob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(20px, -20px) scale(1.08); }
                }
                .animate-fade-up { animation: fadeUp 0.55s ease-out both; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out both; }
                .animate-float-blob { animation: floatBlob 8s ease-in-out infinite; }
            `}</style>

            <ParticipantNavbar />

            <div className="max-w-5xl mx-auto p-4 sm:p-6 animate-fade-up">

                {/* Back */}
                <button
                    onClick={() =>
                        navigate("/participant/events")
                    }
                    className="mb-5 inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 hover:gap-3 transition-all duration-200"
                >
                    <span className="text-lg">←</span>
                    Back to Events
                </button>

                {/* Event Details */}
                <div className="bg-white/90 backdrop-blur rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-white/60">

                    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-10 overflow-hidden">

                        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 animate-float-blob" />
                        <div className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-white/10 animate-float-blob" style={{ animationDelay: "1.5s" }} />

                        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                                {event.name}
                            </h1>

                            <span className="self-start md:self-auto bg-white/95 text-green-600 px-4 py-2 rounded-full font-semibold text-sm shadow-md">
                                {event.status}
                            </span>

                        </div>

                    </div>

                    <div className="p-6 sm:p-10">

                        {/* Description */}
                        <div className="mb-8">

                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                About the Event
                            </h2>

                            <p className="text-gray-600 leading-7 text-sm sm:text-base">
                                {event.description ||
                                    "No description available."}
                            </p>

                        </div>

                        {/* Event Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">

                            <div className="group border border-gray-200/80 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                    Date
                                </p>

                                <p className="text-lg font-semibold text-gray-800 mt-1">
                                    {event.event_date
                                        ? new Date(
                                            event.event_date
                                        ).toLocaleDateString()
                                        : "-"}
                                </p>

                            </div>

                            <div className="group border border-gray-200/80 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                    Time
                                </p>

                                <p className="text-lg font-semibold text-gray-800 mt-1">
                                    {event.start_time} -{" "}
                                    {event.end_time}
                                </p>

                            </div>

                            <div className="group border border-gray-200/80 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                    Venue
                                </p>

                                <p className="text-lg font-semibold text-gray-800 mt-1">
                                    {event.venue}
                                </p>

                            </div>

                            <div className="group border border-gray-200/80 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                    Status
                                </p>

                                <p className="text-lg font-semibold text-green-600 mt-1">
                                    {event.status}
                                </p>

                            </div>

                        </div>

                        {/* Register */}
                        <div className="border-t pt-6">

                            <button
                                onClick={() =>
                                    navigate(
                                        `/participant/events/${event.id}/register`
                                    )
                                }
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                            >
                                Register for this Event
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EventDetails;