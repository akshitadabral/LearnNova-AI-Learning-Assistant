import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    FileText,
    User,
    LogOut,
    BrainCircuit,
    BookOpen,
    Search,
    X,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
        { to: "/documents", icon: FileText, text: "Documents" },
        { to: "/search", icon: Search, text: "Search" },
        { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
        { to: "/profile", icon: User, text: "Profile" }
    ];

    return (
        <>
            <div
                className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleSidebar}
            />

            <aside
                className={`fixed top-0 left-0 h-full w-72 z-50 bg-white/80 backdrop-blur-xl border-r border-slate-200/70 shadow-xl md:relative md:flex md:flex-col md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >

                <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200/70">

                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <img
                                src="/learnnova-icon.svg"
                                alt="LearnNova Logo"
                                className="w-7 h-7 object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                LearnNova
                            </h1>
                            <p className="text-xs text-slate-500">
                                AI Learning Assistant
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-slate-500 hover:text-slate-900"
                    >
                        <X size={22} />
                    </button>

                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <p className="px-3 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Menu
                    </p>

                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={toggleSidebar}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${isActive
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"
                                        }`}>
                                        <link.icon size={18} strokeWidth={2.5} />
                                    </div>

                                    <span>{link.text}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-4 pb-5 border-t border-slate-200/70 pt-4">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-red-100 flex items-center justify-center">
                            <LogOut size={18} strokeWidth={2.5} />
                        </div>
                        Logout
                    </button>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;