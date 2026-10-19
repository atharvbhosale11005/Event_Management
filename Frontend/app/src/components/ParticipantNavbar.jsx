import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function ParticipantNavbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);

    const user = JSON.parse(
        sessionStorage.getItem("user") || "{}"
    );

    const userName = user.name || "Participant";

    const handleLogout = () => {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/login");
    };

    const links = [
        { to: "/participant/dashboard", label: "Dashboard" },
        { to: "/participant/events", label: "Events" },
        { to: "/participant/registrations", label: "Registrations" },
        { to: "/participant/sessions", label: "Sessions" },
        { to: "/participant/attendance", label: "Attendance" },
        { to: "/participant/feedback", label: "Feedback" }
    ];

    const isActive = (path) =>
        location.pathname === path ||
        location.pathname.startsWith(path + "/");

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl text-white shadow-lg shadow-slate-900/20 border-b border-white/5">

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .animate-slide-down { animation: slideDown 0.25s ease-out both; }
                .animate-fade-in   { animation: fadeIn 0.25s ease-out both; }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        to="/participant/dashboard"
                        className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-wide text-white no-underline group"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            E
                        </span>
                        <span>
                            Event<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Hub</span>
                        </span>
                    </Link>


                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">

                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`relative px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200 ${
                                    isActive(link.to)
                                        ? "text-white bg-white/10"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                {link.label}

                                {isActive(link.to) && (
                                    <span className="absolute left-1/2 -bottom-0.5 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" />
                                )}
                            </Link>
                        ))}


                        {/* Divider */}
                        <span className="mx-2 h-6 w-px bg-white/10" />


                        {/* Profile */}
                        <Link
                            to="/participant/profile"
                            className={`flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full no-underline transition-all duration-200 ${
                                isActive("/participant/profile")
                                    ? "bg-white/10 text-white"
                                    : "hover:bg-white/5"
                            }`}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-500/30">
                                {userName.charAt(0).toUpperCase()}
                            </div>

                            <span className="text-sm text-gray-200 max-w-[100px] truncate">
                                {userName}
                            </span>
                        </Link>


                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/40 active:scale-95 transition-all duration-200"
                        >
                            Logout
                        </button>

                    </div>


                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-gray-200 hover:bg-white/10 active:scale-95 transition-all duration-200"
                        aria-label="Toggle menu"
                    >

                        <div className="relative w-6 h-5">

                            <span
                                className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transform transition-all duration-300 ${
                                    mobileOpen ? "top-2 rotate-45" : "top-0"
                                }`}
                            />

                            <span
                                className={`absolute left-0 top-2 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                                    mobileOpen ? "opacity-0" : "opacity-100"
                                }`}
                            />

                            <span
                                className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transform transition-all duration-300 ${
                                    mobileOpen ? "top-2 -rotate-45" : "top-4"
                                }`}
                            />

                        </div>

                    </button>

                </div>

            </div>


            {/* Mobile Menu */}
            {mobileOpen && (

                <div className="lg:hidden animate-slide-down border-t border-white/10 bg-slate-900/95 backdrop-blur-xl">

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">

                        {/* Profile Row */}
                        <Link
                            to="/participant/profile"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 no-underline transition-colors duration-200 mb-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/30">
                                {userName.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {userName}
                                </p>
                                <p className="text-xs text-gray-400">
                                    View profile
                                </p>
                            </div>
                        </Link>


                        {links.map((link, index) => (

                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                style={{ animationDelay: `${index * 30}ms` }}
                                className={`animate-fade-in flex items-center justify-between px-4 py-3 rounded-xl no-underline text-sm font-medium transition-all duration-200 ${
                                    isActive(link.to)
                                        ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white border border-blue-400/20"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span>{link.label}</span>

                                {isActive(link.to) && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px] shadow-blue-400" />
                                )}
                            </Link>

                        ))}


                        <button
                            onClick={() => {
                                setMobileOpen(false);
                                handleLogout();
                            }}
                            className="w-full mt-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold shadow-md shadow-red-500/20 active:scale-[0.98] transition-all duration-200"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            )}

        </nav>
    );
}

export default ParticipantNavbar;