import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ParticipantNavbar from "../components/ParticipantNavbar";
import { getAllEvents } from "../services/eventService";

function Events() {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {

        try {

            const token = sessionStorage.getItem("token");

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

    const getStatusClass = (status) => {

        switch (status) {

            case "UPCOMING":
                return "bg-blue-100 text-blue-700";

            case "ONGOING":
                return "bg-green-100 text-green-700";

            case "COMPLETED":
                return "bg-gray-100 text-gray-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleViewDetails = (eventId) => {

        navigate(
            `/participant/events/${eventId}`
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

            <ParticipantNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

                {/* Heading */}
                <div className="mb-8 animate-fade-up">

                    <div className="flex items-center gap-3 mb-2">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl shadow-lg shadow-blue-200">
                            📅
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            Events
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        Explore available events and view their details.
                    </p>

                </div>


                {/* Error */}
                {error && (

                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-sm animate-fade-in flex items-start gap-3">
                        <span className="text-lg leading-none">⚠️</span>
                        <span className="text-sm sm:text-base">{error}</span>
                    </div>

                )}


                {/* Loading */}
                {loading ? (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">

                        {[1, 2, 3, 4, 5, 6].map((card) => (

                            <div
                                key={card}
                                className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl shadow-md overflow-hidden animate-pulse"
                            >

                                <div className="h-2 bg-slate-200" />

                                <div className="p-6 space-y-4">

                                    <div className="h-5 w-3/4 rounded bg-slate-200" />
                                    <div className="h-3 w-full rounded bg-slate-200" />
                                    <div className="h-3 w-5/6 rounded bg-slate-200" />
                                    <div className="h-10 w-full rounded-lg bg-slate-100 mt-4" />

                                </div>

                            </div>

                        ))}

                    </div>

                ) : events.length === 0 ? (

                    /* No Events */
                    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl p-10 sm:p-14 text-center shadow-lg animate-fade-up">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 text-4xl animate-bounce">
                            📅
                        </div>

                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                            No Events Available
                        </h2>

                        <p className="text-gray-500 mt-2 text-sm sm:text-base">
                            There are currently no events available.
                        </p>

                    </div>

                ) : (

                    /* Events */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {events.map((event, index) => (

                            <div
                                key={event.id}
                                style={{ animationDelay: `${index * 70}ms` }}
                                className="animate-fade-up group bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
                            >

                                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

                                <div className="p-6 flex flex-col flex-1">

                                    {/* Event Name + Status */}
                                    <div className="flex items-start justify-between gap-3 mb-4">

                                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
                                            {event.name}
                                        </h2>

                                        <span
                                            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ring-black/5 ${getStatusClass(
                                                event.status
                                            )}`}
                                        >
                                            {event.status}
                                        </span>

                                    </div>


                                    {/* Short Description */}
                                    <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-6">
                                        {event.description ||
                                            "No description available."}
                                    </p>


                                    {/* Event Information */}
                                    <div className="space-y-3 text-sm text-gray-600">

                                        <div className="flex items-center gap-3">

                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs">
                                                📅
                                            </span>

                                            <span>
                                                {event.event_date}
                                            </span>

                                        </div>


                                        <div className="flex items-center gap-3">

                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs">
                                                🕐
                                            </span>

                                            <span>
                                                {event.start_time} -{" "}
                                                {event.end_time}
                                            </span>

                                        </div>


                                        <div className="flex items-center gap-3">

                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-xs">
                                                📍
                                            </span>

                                            <span>
                                                {event.venue}
                                            </span>

                                        </div>

                                    </div>


                                    {/* View Details */}
                                    <button
                                        onClick={() =>
                                            handleViewDetails(
                                                event.id
                                            )
                                        }
                                        className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-blue-200/60 hover:shadow-lg active:scale-[0.98] transition-all duration-200 mt-auto"
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Events;