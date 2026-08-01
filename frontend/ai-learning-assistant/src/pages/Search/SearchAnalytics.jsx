import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid
} from "recharts";

const SearchAnalytics = () => {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {

        try {

            const response = await axios.get(
                "/api/search-analytics",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            console.log("API RESPONSE:", response.data);
            setAnalytics(response.data.data);

        } catch (error) {
            console.log("API ERROR:", error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return <p className="p-8 text-slate-500">Loading analytics...</p>;
    }

    if (!analytics) {
        return <p className="p-8 text-slate-500">No analytics data found</p>;
    }

    return (
        <div className="p-8 bg-slate-50 min-h-screen">

            <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Search Analytics
            </h1>

            <p className="text-slate-500 mb-8">
                Track your search activity, popular keywords, and search performance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition">
                    <h3 className="text-slate-500">Total Searches</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.totalSearches}</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition">
                    <h3 className="text-slate-500">Average Search Time</h3>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{analytics.averageSearchTime} ms</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition">
                    <h3 className="text-slate-500">No Result Searches</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.noResultSearches}</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition">
                    <h3 className="text-slate-500">This Week</h3>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{analytics.searchesThisWeek}</p>
                </div>

            </div>

            <div className="mt-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">

                <h2 className="text-xl font-semibold text-slate-800 mb-5">
                    Top Search Keywords
                </h2>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.topKeywords || []}>
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

            <div className="mt-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">

                <h2 className="text-xl font-semibold text-slate-800 mb-5">
                    Searches Last 7 Days
                </h2>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.searchesPerDay || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>

        </div>
    );

};

export default SearchAnalytics;