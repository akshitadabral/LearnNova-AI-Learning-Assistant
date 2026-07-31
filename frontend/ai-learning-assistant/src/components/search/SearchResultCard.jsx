import { FileText, Copy, ExternalLink, Hash, FileDigit } from "lucide-react";
import toast from "react-hot-toast";

const SearchResultCard = ({ result, highlight }) => {
  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(result.snippet);
      toast.success("Snippet copied to clipboard!", { duration: 2000 });
    } catch {
      toast.error("Failed to copy snippet.");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-violet-100 shadow-md hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-200/40 transition-all duration-300 overflow-hidden">
      <div className="flex justify-between items-start p-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-300/40">
            <FileText className="text-white" size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {result.title}
            </h2>

            <div className="flex gap-3 mt-3">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
                <FileDigit size={13} />
                Page {result.pageNumber + 1}
              </span>

              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                <Hash size={13} />
                Chunk {result.chunkIndex + 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        <p className="text-[15px] leading-8 text-slate-700">
          {highlight(result.snippet)}
        </p>
      </div>

      <div className="flex justify-between items-center mt-6 px-6 py-5 border-t border-slate-100 bg-slate-50/50">
        <span className="text-sm text-slate-500">
          Excerpt • {result.snippet.length} chars
        </span>

        <div className="flex gap-3">
          <button
            onClick={copySnippet}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all duration-300"
          >
            <Copy size={16} />
            Copy
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-medium hover:scale-105 hover:shadow-xl hover:shadow-violet-300/40 transition-all duration-300">
            <ExternalLink size={16} />
            Open
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;