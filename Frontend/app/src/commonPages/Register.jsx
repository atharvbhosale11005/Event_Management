import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import HomeNavbar from "../components/HomeNavbar";
import { registerUser } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }

        try {

            setLoading(true);

            const result = await registerUser({
                name,
                email,
                password
            });

            if (result.status === "success") {

                setSuccess(
                    "Registration successful. Redirecting to login..."
                );

                setName("");
                setEmail("");
                setPassword("");

                setTimeout(() => {
                    navigate("/login");
                }, 1000);

            }
            else {

                setError(
                    result.message || "Registration failed"
                );

            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to register. Please try again."
            );

        }
        finally {

            setLoading(false);

        }
    };


    const inputClass =
        "w-full px-4 py-3 pl-11 border border-slate-300 rounded-xl bg-white/80 outline-none text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatBlob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(26px, -26px) scale(1.08); }
                }
                @keyframes popIn {
                    0%   { opacity: 0; transform: scale(0.94); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-fade-up  { animation: fadeUp 0.55s ease-out both; }
                .animate-float-blob { animation: floatBlob 9s ease-in-out infinite; }
                .animate-pop-in { animation: popIn 0.3s ease-out both; }
            `}</style>

            <HomeNavbar />

            <div className="relative flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 overflow-hidden">

                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl animate-float-blob" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl animate-float-blob" style={{ animationDelay: "1.5s" }} />

                <div className="relative w-full max-w-md animate-fade-up">

                    {/* Card */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-300/40 border border-white/60 overflow-hidden">

                        {/* Header band */}
                        <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 px-6 sm:px-8 py-8 text-white overflow-hidden">

                            <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10 animate-float-blob" />
                            <div className="absolute -bottom-12 -right-8 h-36 w-36 rounded-full bg-white/10 animate-float-blob" style={{ animationDelay: "1s" }} />

                            <div className="relative text-center">

                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm text-2xl shadow-lg ring-1 ring-white/20">
                                    ✨
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    Create Account
                                </h1>

                                <p className="text-blue-100 text-sm mt-1.5">
                                    Register as an EventHub participant
                                </p>

                            </div>

                        </div>


                        {/* Body */}
                        <div className="p-6 sm:p-8">

                            {/* Error */}
                            {error && (
                                <div className="animate-pop-in mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2.5 shadow-sm">
                                    <span className="text-base leading-none mt-0.5">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}


                            {/* Success */}
                            {success && (
                                <div className="animate-pop-in mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm flex items-start gap-2.5 shadow-sm">
                                    <span className="text-base leading-none mt-0.5">✅</span>
                                    <span>{success}</span>
                                </div>
                            )}


                            {/* Register Form */}
                            <form onSubmit={handleRegister} className="space-y-5">

                                {/* Name */}
                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <span className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                            👤
                                        </span>

                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className={inputClass}
                                        />

                                    </div>

                                </div>


                                {/* Email */}
                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email
                                    </label>

                                    <div className="relative">

                                        <span className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                            ✉️
                                        </span>

                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className={inputClass}
                                        />

                                    </div>

                                </div>


                                {/* Password */}
                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <span className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                            🔒
                                        </span>

                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Create a password"
                                            className={inputClass}
                                        />

                                    </div>

                                </div>


                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-indigo-300 disabled:to-blue-300 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                                >

                                    {loading ? (
                                        <>
                                            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}

                                </button>

                            </form>


                            {/* Divider */}
                            <div className="my-6 flex items-center gap-3">

                                <span className="h-px flex-1 bg-slate-200" />
                                <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">or</span>
                                <span className="h-px flex-1 bg-slate-200" />

                            </div>


                            {/* Login */}
                            <div className="text-center">

                                <p className="text-slate-600 text-sm">

                                    Already have an account?{" "}

                                    <Link
                                        to="/login"
                                        className="text-indigo-600 hover:text-blue-600 font-semibold no-underline hover:underline transition-colors"
                                    >
                                        Login
                                    </Link>

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Small footer text */}
                    <p className="text-center text-xs text-slate-400 mt-6">
                        © 2026 EventHub · Event Management Platform
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;