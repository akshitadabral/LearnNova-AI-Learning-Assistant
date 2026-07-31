import { useState } from "react";
import {
    Search,
    FileText,
    Clock3,
    Database,
    FileSearch,
} from "lucide-react";

import searchService from "../../services/searchService";
import AnalyticsCard from "../../components/search/AnalyticsCard";
import SearchBar from "../../components/search/SearchBar";
import SearchResultCard from "../../components/search/SearchResultCard";
import RecentSearches from "../../components/search/RecentSearches";
import { Link } from "react-router-dom";


const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
        return JSON.parse(localStorage.getItem("recentSearches")) || [];
    });

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);

        try {
            const response = await searchService.searchDocuments(query);

            setResults(response.data.results);
            setAnalytics(response.data.analytics);
            const updated = [
                query,
                ...recentSearches.filter(item => item !== query)
            ].slice(0, 5);

            setRecentSearches(updated);

            localStorage.setItem(
                "recentSearches",
                JSON.stringify(updated)
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const searchAgain = async (text) => {

        setQuery(text);
        setLoading(true);

        try {

            const response = await searchService.searchDocuments(text);

            setResults(response.data.results);
            setAnalytics(response.data.analytics);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    const highlight = (text) => {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, "gi");

        return text.split(regex).map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span
                    key={index}
                    className="bg-yellow-200 text-slate-900 font-semibold px-1 rounded"
                >
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="p-8">

            {/* HEADER */}

            <div className="mb-10 flex justify-between items-start">

                <div>
                    <h1 className="text-4xl font-bold text-slate-900">
                        Knowledge Search
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Quickly find concepts, keywords, and topics across all your uploaded study materials.
                    </p>
                </div>

                <Link
                    to="/search-analytics"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
                    View Search Analytics
                </Link>

            </div>

            {/* SEARCH BAR */}

            <SearchBar
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
                loading={loading}
            />

            <RecentSearches
                searches={recentSearches}
                onSearch={searchAgain}
            />

            { /* ANALYTICS */}
            {analytics && (

                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8 mb-10">

                    <AnalyticsCard
                        title="Documents Indexed"
                        value={analytics.documentsIndexed}
                        icon={<FileText size={22} />}
                    />

                    <AnalyticsCard
                        title="Words Indexed"
                        value={analytics.wordsIndexed.toLocaleString()}
                        icon={<Database size={22} />}
                    />

                    <AnalyticsCard
                        title="Chunks Indexed"
                        value={analytics.chunksIndexed}
                        icon={<FileSearch size={22} />}
                    />

                    <AnalyticsCard
                        title="Search Time"
                        value={`${analytics.searchTime} ms`}
                        icon={<Clock3 size={22} />}
                    />

                </div>

            )}

            {/* RESULT SUMMARY */}

            {results.length > 0 && (

                <div className="mb-6">
                    <div className="flex justify-between items-center">

                        <h2 className="text-xl font-bold text-slate-800">

                            Search Results

                        </h2>

                        <span className="text-slate-500">

                            {results.length} matches found

                        </span>

                    </div>

                </div>

            )}

            {/* EMPTY STATE */}

            {!loading && results.length === 0 && (

                <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center">

                    <Search
                        size={60}
                        className="mx-auto text-slate-300 mb-5"
                    />

                    <h2 className="text-2xl font-semibold">

                        Search your documents

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Find any concept across all uploaded PDFs.

                    </p>

                </div>

            )}

            {/* RESULTS */}

            <div className="space-y-6">

                {results.map((item, index) => (

                    <SearchResultCard
                        key={index}
                        result={item}
                        highlight={highlight}
                    />

                ))}

            </div>



        </div>
    );
};

export default SearchPage;