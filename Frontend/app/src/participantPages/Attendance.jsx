import { useEffect, useState } from "react";

import ParticipantNavbar from "../components/ParticipantNavbar";
import { getMyAttendance } from "../services/attendanceService";

function Attendance() {

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {

        try {

            setLoading(true);
            setError("");

            const token = sessionStorage.getItem("token");

            const result = await getMyAttendance(token);

            if (result.status === "success") {

                setAttendance(result.data || []);

            }
            else {

                setError(
                    result.message || "Unable to load attendance"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load attendance"
            );

        }
        finally {

            setLoading(false);

        }
    };


    const getStatusClass = (status) => {

        if (status === "PRESENT") {
            return "bg-green-100 text-green-700";
        }

        return "bg-red-100 text-red-700";
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
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

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xl font-bold shadow-lg shadow-orange-200">
                            ✓
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            My Attendance
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        Check your attendance for event sessions.
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

                    <div className="space-y-4 animate-fade-in">

                        <div className="hidden md:block bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow-lg overflow-hidden">

                            <div className="bg-slate-100/80 px-6 py-4">
                                <div className="h-4 w-40 rounded bg-slate-200 animate-pulse" />
                            </div>

                            {[1, 2, 3, 4].map((row) => (
                                <div
                                    key={row}
                                    className="border-t border-gray-100 px-6 py-5 flex gap-6"
                                >
                                    <div className="h-4 flex-1 rounded bg-slate-200 animate-pulse" />
                                    <div className="h-4 flex-1 rounded bg-slate-200 animate-pulse" />
                                    <div className="h-4 flex-1 rounded bg-slate-200 animate-pulse" />
                                    <div className="h-4 w-24 rounded-full bg-slate-200 animate-pulse" />
                                </div>
                            ))}

                        </div>

                        <div className="md:hidden space-y-4">
                            {[1, 2, 3].map((card) => (
                                <div
                                    key={card}
                                    className="bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow-md p-5 space-y-3"
                                >
                                    <div className="h-4 w-2/3 rounded bg-slate-200 animate-pulse" />
                                    <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
                                    <div className="h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
                                </div>
                            ))}
                        </div>

                    </div>

                ) : attendance.length === 0 ? (

                    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl p-10 sm:p-14 text-center shadow-lg animate-fade-up">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-4xl animate-bounce">
                            ✓
                        </div>

                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                            No Attendance Records
                        </h2>

                        <p className="text-gray-500 mt-2 text-sm sm:text-base">
                            No attendance records are available yet.
                        </p>

                    </div>

                ) : (

                    <>
                        {/* ---------- Desktop Table ---------- */}
                        <div className="hidden md:block bg-white/80 backdrop-blur border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-up">

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gradient-to-r from-slate-100 to-slate-50">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-700">
                                                Event
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-700">
                                                Session
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-700">
                                                Date
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-700">
                                                Time
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-700">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {attendance.map((record, index) => (

                                            <tr
                                                key={record.id}
                                                style={{ animationDelay: `${index * 55}ms` }}
                                                className="animate-fade-up border-t border-gray-100 hover:bg-blue-50/60 transition-colors duration-200"
                                            >

                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {record.event_name || "-"}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {record.session_name || "-"}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {record.session_date || "-"}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {record.start_time || "-"}
                                                    {" - "}
                                                    {record.end_time || "-"}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ring-black/5 ${getStatusClass(record.status)}`}
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                        {record.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* ---------- Mobile Cards ---------- */}
                        <div className="md:hidden space-y-4">

                            {attendance.map((record, index) => (

                                <div
                                    key={record.id}
                                    style={{ animationDelay: `${index * 60}ms` }}
                                    className="animate-fade-up bg-white/80 backdrop-blur border border-white/60 rounded-2xl shadow-md p-5 hover:shadow-xl transition-shadow duration-300"
                                >

                                    <div className="flex items-start justify-between gap-3 mb-3">

                                        <h3 className="font-semibold text-slate-900 text-base leading-snug">
                                            {record.event_name || "-"}
                                        </h3>

                                        <span
                                            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(record.status)}`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {record.status}
                                        </span>

                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">

                                        <p>
                                            <span className="font-medium text-slate-700">Session: </span>
                                            {record.session_name || "-"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-slate-700">Date: </span>
                                            {record.session_date || "-"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-slate-700">Time: </span>
                                            {record.start_time || "-"}
                                            {" - "}
                                            {record.end_time || "-"}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>
                    </>

                )}

            </main>

        </div>
    );
}

export default Attendance;