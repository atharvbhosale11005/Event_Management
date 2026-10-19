import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";

import {
    getAllParticipants,
    getParticipantById
} from "../services/participantService";


function ParticipantManagement() {

    const token = sessionStorage.getItem("token");

    const [participants, setParticipants] = useState([]);

    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        loadParticipants();
    }, []);


    const loadParticipants = async () => {

        try {

            setLoading(true);
            setError("");

            const result = await getAllParticipants(token);

            if (result.status === "success") {

                setParticipants(result.data || []);

            }
            else {

                setError(
                    result.message ||
                    "Unable to load participants"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load participants"
            );

        }
        finally {

            setLoading(false);

        }
    };


    const handleView = async (participantId) => {

        try {

            setLoadingDetails(true);
            setError("");
            setMessage("");

            const result = await getParticipantById(
                token,
                participantId
            );

            if (result.status === "success") {

                setSelectedParticipant(result.data);

            }
            else {

                setError(
                    result.message ||
                    "Unable to load participant details"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load participant details"
            );

        }
        finally {

            setLoadingDetails(false);

        }
    };


    const closeDetails = () => {

        setSelectedParticipant(null);

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

                <div className="mb-8 animate-fade-up">

                    <div className="flex items-center gap-3 mb-2">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl shadow-lg shadow-green-200">
                            👥
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            Participant Management
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        View and manage registered participants.
                    </p>

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


                {/* Participant Details */}

                {selectedParticipant && (

                    <div className="animate-fade-up bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-6 mb-8">

                        <div className="flex items-center justify-between mb-6 gap-3">

                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                                Participant Details
                            </h2>


                            <button
                                onClick={closeDetails}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold active:scale-95 transition-all duration-200"
                            >

                                Close

                            </button>

                        </div>


                        {loadingDetails ? (

                            <div className="p-6 text-center animate-pulse">

                                <div className="mx-auto h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-3" />

                                <p className="text-gray-500 text-sm">
                                    Loading participant details...
                                </p>

                            </div>

                        ) : (

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">


                                <div className="p-4 bg-gradient-to-br from-white to-slate-50 border border-gray-200/80 rounded-xl hover:shadow-md transition-shadow duration-300">

                                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        Name
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-1">
                                        {selectedParticipant.name || "-"}
                                    </p>

                                </div>


                                <div className="p-4 bg-gradient-to-br from-white to-slate-50 border border-gray-200/80 rounded-xl hover:shadow-md transition-shadow duration-300">

                                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        Email
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-1 break-all">
                                        {selectedParticipant.email || "-"}
                                    </p>

                                </div>


                                <div className="p-4 bg-gradient-to-br from-white to-slate-50 border border-gray-200/80 rounded-xl hover:shadow-md transition-shadow duration-300">

                                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        Participant ID
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-1">
                                        {selectedParticipant.id ||
                                            selectedParticipant.userId ||
                                            "-"}
                                    </p>

                                </div>


                                <div className="p-4 bg-gradient-to-br from-white to-slate-50 border border-gray-200/80 rounded-xl hover:shadow-md transition-shadow duration-300">

                                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                                        Role
                                    </p>

                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold ring-1 ring-inset ring-blue-200">
                                        {selectedParticipant.role || "PARTICIPANT"}
                                    </span>

                                </div>


                                {selectedParticipant.created_at && (

                                    <div className="p-4 bg-gradient-to-br from-white to-slate-50 border border-gray-200/80 rounded-xl hover:shadow-md transition-shadow duration-300 sm:col-span-2">

                                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                            Registered On
                                        </p>

                                        <p className="font-semibold text-slate-900 mt-1">
                                            {String(selectedParticipant.created_at)}
                                        </p>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                )}


                {/* Participant List */}

                <div className="bg-white/90 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-up">


                    <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">

                        <div>

                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                                All Participants
                            </h2>

                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {participants.length} participant
                                {participants.length !== 1 ? "s" : ""}
                            </p>

                        </div>

                    </div>


                    {loading ? (

                        <div className="p-10 text-center animate-pulse">

                            <div className="mx-auto h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />

                            <p className="text-gray-500">Loading participants...</p>

                        </div>

                    ) : participants.length === 0 ? (

                        <div className="p-10 sm:p-12 text-center">

                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-200 text-3xl animate-bounce">
                                👥
                            </div>

                            <p className="text-gray-500">No participants found.</p>

                        </div>

                    ) : (

                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gradient-to-r from-slate-100 to-slate-50">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                ID
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Name
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Email
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Role
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {participants.map(
                                            (participant, index) => (

                                                <tr
                                                    key={participant.id || participant.userId}
                                                    style={{ animationDelay: `${index * 40}ms` }}
                                                    className="animate-fade-up border-t border-gray-100 hover:bg-green-50/60 transition-colors duration-200"
                                                >

                                                    <td className="px-6 py-4 text-gray-700">
                                                        {participant.id ||
                                                            participant.userId ||
                                                            "-"}
                                                    </td>


                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-slate-900">
                                                            {participant.name || "-"}
                                                        </p>
                                                    </td>


                                                    <td className="px-6 py-4 text-gray-700">
                                                        {participant.email || "-"}
                                                    </td>


                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200">
                                                            {participant.role || "PARTICIPANT"}
                                                        </span>
                                                    </td>


                                                    <td className="px-6 py-4">

                                                        <button
                                                            onClick={() =>
                                                                handleView(
                                                                    participant.id ||
                                                                    participant.userId
                                                                )
                                                            }
                                                            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium active:scale-95 transition-all duration-200"
                                                        >
                                                            View
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>


                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-gray-100">

                                {participants.map(
                                    (participant, index) => (

                                        <div
                                            key={participant.id || participant.userId}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                            className="animate-fade-up p-5 space-y-3"
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <p className="font-semibold text-slate-900 truncate">
                                                        {participant.name || "-"}
                                                    </p>

                                                    <p className="text-xs text-gray-500 truncate">
                                                        {participant.email || "-"}
                                                    </p>

                                                </div>

                                                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200">
                                                    {participant.role || "PARTICIPANT"}
                                                </span>

                                            </div>

                                            <p className="text-xs text-gray-500">
                                                ID: {participant.id || participant.userId || "-"}
                                            </p>

                                            <button
                                                onClick={() =>
                                                    handleView(
                                                        participant.id ||
                                                        participant.userId
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-semibold active:scale-[0.98] transition-all duration-200"
                                            >
                                                View Details
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>
                        </>

                    )}

                </div>

            </main>

        </div>

    );
}

export default ParticipantManagement;