import React from "react";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Trash2,
    BookOpen,
    BrainCircuit,
    Clock,
    Sparkles
} from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return "N/A";

    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(1)} ${units[index]}`;
};


const DocumentCard = ({ document, onDelete }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document);
    };


    return (
        <div
            onClick={handleNavigate}
            className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200/30 hover:border-blue-300"
        >

            <div className="flex items-start justify-between">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition">
                    <FileText className="w-7 h-7 text-white" />
                </div>


                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                >
                    <Trash2 className="w-4 h-4" />
                </button>

            </div>


            <div className="flex justify-between items-start mt-5 gap-3">

                <h3
                    className="text-lg font-bold text-slate-900 line-clamp-2"
                    title={document.title}
                >
                    {document.title}
                </h3>


                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${document.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            :
                            document.status === "processing"
                                ? "bg-amber-100 text-amber-700"
                                :
                                "bg-slate-100 text-slate-600"
                        }`}
                >
                    {document.status}
                </span>

            </div>


            <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                <span>{formatFileSize(document.fileSize)}</span>

                <span>•</span>

                <span>
                    PDF
                </span>
            </div>


            <div className="flex gap-3 mt-5">

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50">
                    <BookOpen className="w-4 h-4 text-purple-600" />

                    <span className="text-xs font-semibold text-purple-700">
                        {document.flashcardCount || 0} Flashcards
                    </span>
                </div>


                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50">
                    <BrainCircuit className="w-4 h-4 text-emerald-600" />

                    <span className="text-xs font-semibold text-emerald-700">
                        {document.quizCount || 0} Quizzes
                    </span>
                </div>

            </div>


            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">

                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-4 h-4" />
                    {moment(document.createdAt).fromNow()}
                </div>


                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition">
                    Open
                    <Sparkles className="w-4 h-4" />
                </div>

            </div>

        </div>
    );
};

export default DocumentCard;