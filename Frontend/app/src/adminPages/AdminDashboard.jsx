import { Link } from "react-router-dom";

import AdminNavbar from "../components/AdminNavbar";

function AdminDashboard() {

    const user = JSON.parse(
        sessionStorage.getItem("user") || "{}"
    );

    const userName = user.name || "Admin";

    const cards = [
        {
            to: "/admin/events",
            icon: "📅",
            title: "Event Management",
            description: "Create, update, view and delete events.",
            color: "from-blue-500 to-blue-600",
            bg: "bg-blue-100 text-blue-600"
        },
        {
            to: "/admin/sessions",
            icon: "🎯",
            title: "Session Management",
            description: "Manage sessions associated with events.",
            color: "from-purple-500 to-violet-600",
            bg: "bg-purple-100 text-purple-600"
        },
        {
            to: "/admin/speakers",
            icon: "🎤",
            title: "Speaker Management",
            description: "Manage speakers and assign them to sessions.",
            color: "from-orange-500 to-amber-600",
            bg: "bg-orange-100 text-orange-600"
        },
        {
            to: "/admin/participants",
            icon: "👥",
            title: "Participants",
            description: "View registered participants and their event registrations.",
            color: "from-green-500 to-emerald-600",
            bg: "bg-green-100 text-green-600"
        },
        {
            to: "/admin/attendance",
            icon: "✓",
            title: "Attendance",
            description: "Mark and manage participant attendance for sessions.",
            color: "from-red-500 to-rose-600",
            bg: "bg-red-100 text-red-600"
        },
        {
            to: "/admin/feedback",
            icon: "⭐",
            title: "Feedback",
            description: "View feedback submitted by event participants.",
            color: "from-yellow-400 to-orange-500",
            bg: "bg-yellow-100 text-yellow-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatBlob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(24px, -24px) scale(1.1); }
                }
                .animate-fade-up { animation: fadeUp 0.55s ease-out both; }
                .animate-float-blob { animation: floatBlob 9s ease-in-out infinite; }
            `}</style>

            <AdminNavbar />

            {/* Welcome Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">

                <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-blue-500/20 blur-2xl animate-float-blob" />
                <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-2xl animate-float-blob" style={{ animationDelay: "1.5s" }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

                    <p className="text-blue-400 font-semibold mb-2 text-xs sm:text-sm tracking-wider uppercase animate-fade-up">
                        Admin Dashboard
                    </p>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
                        Welcome, {userName}!
                    </h1>

                    <p className="text-gray-300 text-sm sm:text-base max-w-2xl animate-fade-up" style={{ animationDelay: "160ms" }}>
                        Manage events, participants, sessions, speakers,
                        attendance and feedback.
                    </p>

                </div>

            </section>


            {/* Management Options */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    Management
                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

                    {cards.map((card, index) => (

                        <Link
                            key={card.to}
                            to={card.to}
                            style={{ animationDelay: `${index * 70}ms` }}
                            className="animate-fade-up group relative bg-white/90 backdrop-blur border border-white/60 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 no-underline overflow-hidden"
                        >

                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                {card.icon}
                            </div>

                            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                                {card.title}
                            </h3>

                            <p className="text-gray-600 text-sm leading-6">
                                {card.description}
                            </p>

                        </Link>

                    ))}

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;