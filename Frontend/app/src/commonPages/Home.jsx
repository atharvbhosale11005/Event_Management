import { Link } from "react-router-dom";

import HomeNavbar from "../components/HomeNavbar";

function Home() {

    const features = [
        {
            icon: "📅",
            title: "Event Management",
            description: "Create and manage events with dates, timings, venues and event status.",
            bg: "bg-blue-100 text-blue-600",
            gradient: "from-blue-500 to-blue-600"
        },
        {
            icon: "📝",
            title: "Event Registration",
            description: "Participants can register for events and manage their registrations easily.",
            bg: "bg-green-100 text-green-600",
            gradient: "from-green-500 to-emerald-600"
        },
        {
            icon: "🎯",
            title: "Session Management",
            description: "Organize sessions with schedules, venues and assigned speakers.",
            bg: "bg-purple-100 text-purple-600",
            gradient: "from-purple-500 to-violet-600"
        },
        {
            icon: "🎤",
            title: "Speaker Management",
            description: "Maintain speaker information and assign speakers to event sessions.",
            bg: "bg-orange-100 text-orange-600",
            gradient: "from-orange-500 to-amber-600"
        },
        {
            icon: "✓",
            title: "Attendance",
            description: "Track participant attendance for individual sessions.",
            bg: "bg-red-100 text-red-600",
            gradient: "from-red-500 to-rose-600"
        },
        {
            icon: "⭐",
            title: "Post-Event Feedback",
            description: "Collect ratings and comments from participants after events and sessions.",
            bg: "bg-yellow-100 text-yellow-600",
            gradient: "from-yellow-400 to-orange-500"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">

            <HomeNavbar />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes floatBlob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(28px, -28px) scale(1.1); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-fade-up  { animation: fadeUp 0.6s ease-out both; }
                .animate-fade-in  { animation: fadeIn 0.7s ease-out both; }
                .animate-float-blob { animation: floatBlob 10s ease-in-out infinite; }
            `}</style>


            {/* ==================== HERO SECTION ==================== */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">

                {/* Decorative blobs */}
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-float-blob" />
                <div className="absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl animate-float-blob" style={{ animationDelay: "2s" }} />

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                        backgroundSize: "48px 48px"
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">

                    <div className="max-w-3xl">

                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 animate-fade-up">

                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />

                            Event Management Platform

                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "80ms" }}>

                            Manage Events.
                            <br />
                            Connect People.
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                                Create Experiences.
                            </span>

                        </h1>

                        <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: "160ms" }}>
                            A simple platform to manage events, registrations,
                            sessions, speakers, attendance and post-event
                            feedback from one place.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up" style={{ animationDelay: "240ms" }}>

                            <Link
                                to="/register"
                                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 active:scale-[0.98] transition-all duration-200 no-underline"
                            >
                                Register Now
                                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                            </Link>

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-slate-900 text-white font-semibold active:scale-[0.98] transition-all duration-200 no-underline"
                            >
                                Login
                            </Link>

                        </div>

                    </div>

                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />

            </section>


            {/* ==================== FEATURES SECTION ==================== */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

                <div className="text-center mb-12 sm:mb-16 animate-fade-up">

                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wider uppercase mb-4">
                        Features
                    </span>

                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent mb-3">
                        Everything You Need for Your Event
                    </h2>

                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                        Manage the complete event lifecycle from one platform.
                    </p>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

                    {features.map((feature, index) => (

                        <div
                            key={feature.title}
                            style={{ animationDelay: `${index * 80}ms` }}
                            className="animate-fade-up group relative bg-white/90 backdrop-blur border border-slate-200/70 rounded-2xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                        >

                            {/* Gradient top accent */}
                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 text-sm leading-6">
                                {feature.description}
                            </p>

                        </div>

                    ))}

                </div>

            </section>


            {/* ==================== CALL TO ACTION ==================== */}
            <section className="relative bg-slate-900 text-white overflow-hidden">

                {/* Decorative blobs */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">

                    <div className="max-w-2xl mx-auto animate-fade-up">

                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                            Ready to Join an Event?
                        </h2>

                        <p className="text-gray-300 mb-8 text-sm sm:text-base">
                            Register as a participant and start exploring events.
                        </p>

                        <Link
                            to="/register"
                            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60 active:scale-[0.98] transition-all duration-200 no-underline"
                        >
                            Create Account
                            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </Link>

                    </div>

                </div>

            </section>


            {/* ==================== FOOTER ==================== */}
            <footer className="bg-slate-950 text-gray-400 border-t border-white/5">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        <div className="flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                                E
                            </span>

                            <p className="text-sm">
                                © 2026 EventHub. All rights reserved.
                            </p>

                        </div>

                        <p className="text-sm">
                            Event Management Platform
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;