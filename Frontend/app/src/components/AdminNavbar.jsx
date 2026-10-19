import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminNavbar() {

    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        `relative px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200 ${
            isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${
            isActive
                ? "bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-700 border border-blue-400/30"
                : "text-slate-700 hover:bg-slate-100"
        }`;

    const links = [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/events", label: "Events" },
        { to: "/admin/sessions", label: "Sessions" },
        { to: "/admin/speakers", label: "Speakers" },
        { to: "/admin/participants", label: "Participants" },
        { to: "/admin/attendance", label: "Attendance" },
        { to: "/admin/feedback", label: "Feedback" }
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-slate-200/50">

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-6px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-down { animation: slideDown 0.25s ease-out both; }
                .animate-fade-in   { animation: fadeIn 0.3s ease-out both; }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16 gap-3">

                    {/* Logo — always visible */}
                    <div
                        className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900 cursor-pointer select-none group shrink-0"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            ⚙
                        </span>

                        <span className="whitespace-nowrap">
                            Event
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Admin
                            </span>
                        </span>
                    </div>


                    {/* ⬇️ DESKTOP NAV — ONLY shows at lg (1024px+) */}
                    <div className="hidden lg:flex items-center gap-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={navLinkClass}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>


                    {/* Right side */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                        {/* Admin info (hidden below sm) */}
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-800 leading-tight">Admin</p>
                                <p className="text-xs text-slate-500 leading-tight">Administrator</p>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/30">
                                A
                            </div>
                        </div>

                        {/* Logout (hidden below sm) */}
                        <button
                            onClick={handleLogout}
                            className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/40 active:scale-95 transition-all duration-200"
                        >
                            Logout
                        </button>

                        {/* ⬇️ HAMBURGER — ONLY shows below lg */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 active:scale-95 transition-all duration-200"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-6 h-5">
                                <span className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transform transition-all duration-300 ${mobileOpen ? "top-2 rotate-45" : "top-0"}`} />
                                <span className={`absolute left-0 top-2 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
                                <span className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transform transition-all duration-300 ${mobileOpen ? "top-2 -rotate-45" : "top-4"}`} />
                            </div>
                        </button>

                    </div>

                </div>

            </div>


            {/* ⬇️ MOBILE MENU — ONLY shows below lg */}
            {mobileOpen && (
                <div className="lg:hidden animate-slide-down border-t border-slate-200/80 bg-white/95 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">

                        {/* Admin Card */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200/80 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/30">
                                A
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">Admin</p>
                                <p className="text-xs text-slate-500">Administrator</p>
                            </div>
                        </div>

                        {links.map((link, index) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                style={{ animationDelay: `${index * 40}ms` }}
                                className={`${mobileNavLinkClass} animate-fade-in`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span>{link.label}</span>
                                        {isActive && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px] shadow-blue-500" />
                                        )}
                                    </>
                                )}
                            </NavLink>
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

export default AdminNavbar;