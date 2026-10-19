import { useEffect, useState } from "react";

import ParticipantNavbar from "../components/ParticipantNavbar";
import {
    getMyRegistrations,
    cancelRegistration
} from "../services/registrationService";

function MyRegistrations() {

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        loadRegistrations();
    }, []);

    const loadRegistrations = async () => {

        try {

            setLoading(true);
            setError("");

            const token = sessionStorage.getItem("token");

            const result = await getMyRegistrations(token);

            if (result.status === "success") {

                setRegistrations(result.data || []);

            }
            else {

                setError(
                    result.message || "Unable to load registrations"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load registrations"
            );

        }
        finally {

            setLoading(false);

        }
    };


    const handleCancel = async (registrationId) => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this registration?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            setCancellingId(registrationId);
            setError("");
            setMessage("");

            const token = sessionStorage.getItem("token");

            const result = await cancelRegistration(
                token,
                registrationId
            );

            if (result.status === "success") {

                setMessage(
                    "Registration cancelled successfully."
                );

                loadRegistrations();

            }
            else {

                setError(
                    result.message || "Unable to cancel registration"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to cancel registration"
            );

        }
        finally {

            setCancellingId(null);

        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

                {/* Heading */}
                <div className="mb-8 animate-fade-up">

                    <div className="flex items-center gap-3 mb-2">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl shadow-lg shadow-green-200">
                            📝
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            My Registrations
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        View and manage your event registrations.
                    </p>

                </div>


                {/* Error */}
                {error && (
                    <div className="animate-pop-in mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-sm flex items-start gap-3">
                        <span className="text-lg leading-none">⚠️</span>
                        <span className="text-sm sm:text-base">{error}</span>
                    </div>
                )}


                {/* Success */}
                {message && (
                    <div className="animate-pop-in mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 shadow-sm flex items-start gap-3">
                        <span className="text-lg leading-none">✅</span>
                        <span className="text-sm sm:text-base">{message}</span>
                    </div>
                )}


                {/* Loading */}
                {loading ? (

                    <div className="space-y-4 animate-pulse">

                        <div className="hidden md:block bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow-lg overflow-hidden">

                            <div className="bg-slate-100/80 px-6 py-4">
                                <div className="h-4 w-40 rounded bg-slate-200" />
                            </div>

                            {[1, 2, 3].map((row) => (
                                <div key={row} className="border-t border-gray-100 px-6 py-5 flex gap-6">
                                    <div className="h-4 flex-1 rounded bg-slate-200" />
                                    <div className="h-4 flex-1 rounded bg-slate-200" />
                                    <div className="h-4 flex-1 rounded bg-slate-200" />
                                    <div className="h-8 w-24 rounded-lg bg-slate-200" />
                                </div>
                            ))}

                        </div>

                        <div className="md:hidden space-y-4">
                            {[1, 2, 3].map((card) => (
                                <div key={card} className="bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow-md p-5 space-y-3">
                                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                                    <div className="h-3 w-1/3 rounded bg-slate-200" />
                                    <div className="h-9 w-full rounded-lg bg-slate-200" />
                                </div>
                            ))}
                        </div>

                    </div>

                ) : registrations.length === 0 ? (

                    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl p-10 sm:p-14 text-center shadow-lg animate-fade-up">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-200 text-4xl animate-bounce">
                            📝
                        </div>

                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                            No Registrations
                        </h2>

                        <p className="text-gray-500 mt-2 text-sm sm:text-base">
                            You have not registered for any events yet.
                        </p>

                    </div>

                ) : (

                    <>
                        {/* ---------- Desktop Table ---------- */}
                        <div className="hidden md:block bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-up">

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gradient-to-r from-slate-100 to-slate-50">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
                                                Event
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
                                                Date
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
                                                Venue
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
                                                Registered On
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {registrations.map((registration, index) => (

                                            <tr
                                                key={registration.id}
                                                style={{ animationDelay: `${index * 55}ms` }}
                                                className="animate-fade-up border-t border-gray-100 hover:bg-blue-50/60 transition-colors duration-200"
                                            >

                                                <td className="px-6 py-4">

                                                    <div className="font-semibold text-slate-900">
                                                        {registration.name ||
                                                            registration.event_name ||
                                                            "Event"}
                                                    </div>

                                                </td>


                                                <td className="px-6 py-4 text-gray-600">
                                                    {registration.event_date || "-"}
                                                </td>


                                                <td className="px-6 py-4 text-gray-600">
                                                    {registration.venue || "-"}
                                                </td>


                                                <td className="px-6 py-4 text-gray-600">
                                                    {registration.registered_at || "-"}
                                                </td>


                                                <td className="px-6 py-4">

                                                    <button
                                                        onClick={() =>
                                                            handleCancel(
                                                                registration.id
                                                            )
                                                        }
                                                        disabled={
                                                            cancellingId ===
                                                            registration.id
                                                        }
                                                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
                                                    >
                                                        {cancellingId ===
                                                        registration.id
                                                            ? "Cancelling..."
                                                            : "Cancel"}
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* ---------- Mobile Cards ---------- */}
                        <div className="md:hidden space-y-4">

                            {registrations.map((registration, index) => (

                                <div
                                    key={registration.id}
                                    style={{ animationDelay: `${index * 60}ms` }}
                                    className="animate-fade-up bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-md p-5 hover:shadow-xl transition-shadow duration-300"
                                >

                                    <h3 className="font-semibold text-slate-900 text-base mb-3">
                                        {registration.name ||
                                            registration.event_name ||
                                            "Event"}
                                    </h3>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">

                                        <p>
                                            <span className="font-medium text-slate-700">Date: </span>
                                            {registration.event_date || "-"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-slate-700">Venue: </span>
                                            {registration.venue || "-"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-slate-700">Registered: </span>
                                            {registration.registered_at || "-"}
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            handleCancel(
                                                registration.id
                                            )
                                        }
                                        disabled={
                                            cancellingId ===
                                            registration.id
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm active:scale-[0.98] transition-all duration-200"
                                    >
                                        {cancellingId ===
                                        registration.id
                                            ? "Cancelling..."
                                            : "Cancel Registration"}
                                    </button>

                                </div>

                            ))}

                        </div>
                    </>

                )}

            </main>

        </div>
    );
}

export default MyRegistrations;