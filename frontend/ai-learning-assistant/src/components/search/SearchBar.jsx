import { Search, X } from "lucide-react";

const SearchBar = ({
  query,
  setQuery,
  handleSearch,
  loading,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-violet-200 p-5">

      <div className="flex gap-3">

        <div className="relative flex-1">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500"
            size={20}
          />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search notes, concepts, formulas..."
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-slate-300
              bg-white
              pl-12
              pr-12
              outline-none
              transition-all
              duration-300
              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-100
            "
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition"
            >
              <X size={18} />
            </button>
          )}

        </div>

        <button
          disabled={loading}
          onClick={handleSearch}
          className="
            px-8
            rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            via-violet-600
            to-purple-600
            text-white
            font-semibold
            hover:scale-105
            hover:shadow-xl
            hover:shadow-violet-300/40
            transition-all
            duration-300
            disabled:opacity-60
            disabled:hover:scale-100
          "
        >
          {loading ? "Searching..." : "Search"}
        </button>

      </div>

    </div>
  );
};

export default SearchBar;