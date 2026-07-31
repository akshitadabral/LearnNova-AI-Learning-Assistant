import { History } from "lucide-react";

const RecentSearches = ({ searches, onSearch }) => {
  if (searches.length === 0) return null;

  return (
    <div className="mt-6">

      <div className="flex items-center gap-2 mb-3">

        <History size={18} className="text-slate-500"/>

        <h3 className="font-semibold text-slate-700">
          Recent Searches
        </h3>

      </div>

      <div className="flex flex-wrap gap-3">

        {searches.map((item,index)=>(
          <button
            key={index}
            onClick={()=>onSearch(item)}
            className="
            px-4
            py-2
            rounded-full
            bg-slate-100
            hover:bg-blue-100
            hover:text-blue-700
            transition
            text-sm
            font-medium
            "
          >
            {item}
          </button>
        ))}

      </div>

    </div>
  );
};

export default RecentSearches;