import axiosInstance from "../utils/axiosInstance";

const getWeeklyAnalytics = async () => {
    try {
        const response = await axiosInstance.get("/api/analytics/weekly");
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Failed to fetch analytics",
        };
    }
};

const analyticsService = {
    getWeeklyAnalytics,
};

export default analyticsService;