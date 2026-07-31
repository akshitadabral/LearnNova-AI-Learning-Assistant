import axiosInstance from "../utils/axiosInstance";

const searchDocuments = async (query) => {
    const response = await axiosInstance.get(`/api/search?q=${encodeURIComponent(query)}`);
    return response.data;
};

export default {
    searchDocuments
};