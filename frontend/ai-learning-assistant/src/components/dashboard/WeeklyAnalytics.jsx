import React, { useEffect, useState } from "react";
import analyticsService from "../../services/analyticsService";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const WeeklyAnalytics = () => {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchAnalytics = async () => {
            try {
                const data = await analyticsService.getWeeklyAnalytics();
                setAnalytics(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();

    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                Loading analytics...
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-6 mt-6">

            <h2 className="text-xl font-bold mb-6">
                Weekly Analytics
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-8">

                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <h3 className="text-3xl font-bold">
                        {analytics.documents}
                    </h3>
                    <p>Documents</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center">
                    <h3 className="text-3xl font-bold">
                        {analytics.quizzes}
                    </h3>
                    <p>Quizzes</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <h3 className="text-3xl font-bold">
                        {analytics.flashcards}
                    </h3>
                    <p>Flashcards</p>
                </div>

            </div>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <BarChart data={analytics.weeklyActivity}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="uploads"
                        fill="#3b82f6"
                        name="Uploads"
                    />

                    <Bar
                        dataKey="quizzes"
                        fill="#22c55e"
                        name="Quizzes"
                    />

                    <Bar
                        dataKey="flashcards"
                        fill="#a855f7"
                        name="Flashcards"
                    />

                </BarChart>
            </ResponsiveContainer>

        </div>
    );
};

export default WeeklyAnalytics;