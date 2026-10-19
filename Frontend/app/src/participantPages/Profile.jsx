import { useEffect, useState } from "react";

import ParticipantNavbar from "../components/ParticipantNavbar";
import { getParticipantProfile } from "../services/participantService";

function Profile() {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const token = sessionStorage.getItem("token");

            const result = await getParticipantProfile(token);

            if (result.status === "success") {

                setProfile(result.data);

            }
            else {

                setError(
                    result.message ||
                    "Unable to load profile"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to load profile"
            );

        }
        finally {

            setLoading(false);

        }
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
                @keyframes floatBlob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(20px, -20px) scale(1.1); }
                }
                .animate-fade-up { animation: fadeUp 0.55s ease-out both; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out both; }
                .animate-float-blob { animation: floatBlob 9s ease-in-out infinite; }
            `}</style>

            <ParticipantNavbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

                {/* Heading */}
                <div className="mb-8 animate-fade-up">

                    <div className="flex items-center gap-3 mb-2">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-white text-xl shadow-lg shadow-slate-300">
                            👤
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                            My Profile
                        </h1>

                    </div>

                    <p className="text-gray-600 text-sm sm:text-base">
                        View your EventHub participant information.
                    </p>

                </div>


                {/* Error */}
                {error && (
                    <div className="animate-fade-in mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-sm flex items-start gap-3">
                        <span className="text-lg leading-none">⚠️</span>
                        <span className="text-sm sm:text-base">{error}</span>
                    </div>
                )}


                {/* Loading */}
                {loading ? (

                    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg overflow-hidden animate-pulse border border-white/60">

                        <div className="h-40 bg-gradient-to-r from-slate-200 to-slate-300" />

                        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 w-1/3 rounded bg-slate-200" />
                                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                                </div>
                            ))}
                        </div>

                    </div>

                ) : profile ? (

                    <div className="animate-fade-up bg-white/90 backdrop-blur border border-white/60 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">

                        {/* Profile Header */}
                        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 sm:px-10 py-10 text-white overflow-hidden">

                            <div className="absolute -top-16 -right-10 h-52 w-52 rounded-full bg-blue-500/20 blur-2xl animate-float-blob" />
                            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-2xl animate-float-blob" style={{ animationDelay: "1.5s" }} />

                            <div className="relative flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">

                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-xl ring-4 ring-white/20">

                                    {(profile.name || "P")
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>

                                <div>

                                    <h2 className="text-2xl sm:text-3xl font-bold">
                                        {profile.name || "Participant"}
                                    </h2>

                                    <p className="text-gray-300 mt-1 text-sm sm:text-base">
                                        Participant
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Profile Information */}
                        <div className="p-6 sm:p-10">

                            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                Account Information
                            </h3>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Name */}
                                <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-white to-slate-50 p-5 hover:shadow-md transition-shadow duration-300">

                                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        Full Name
                                    </p>

                                    <p className="font-medium text-slate-900">
                                        {profile.name || "-"}
                                    </p>

                                </div>


                                {/* Email */}
                                <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-white to-slate-50 p-5 hover:shadow-md transition-shadow duration-300">

                                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        Email
                                    </p>

                                    <p className="font-medium text-slate-900 break-all">
                                        {profile.email || "-"}
                                    </p>

                                </div>


                                {/* Role */}
                                <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-white to-slate-50 p-5 hover:shadow-md transition-shadow duration-300">

                                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                                        Role
                                    </p>

                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold ring-1 ring-inset ring-blue-200">
                                        {profile.role || "PARTICIPANT"}
                                    </span>

                                </div>


                                {/* User ID */}
                                <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-white to-slate-50 p-5 hover:shadow-md transition-shadow duration-300">

                                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                        User ID
                                    </p>

                                    <p className="font-medium text-slate-900">
                                        {profile.id ||
                                            profile.userId ||
                                            "-"}
                                    </p>

                                </div>


                                {/* Created At */}
                                {profile.created_at && (
                                    <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-white to-slate-50 p-5 hover:shadow-md transition-shadow duration-300">

                                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                            Account Created
                                        </p>

                                        <p className="font-medium text-slate-900">
                                            {profile.created_at}
                                        </p>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl p-10 text-center shadow-lg animate-fade-up">

                        <p className="text-gray-500">
                            Profile information is not available.
                        </p>

                    </div>

                )}

            </main>

        </div>
    );
}

export default Profile;