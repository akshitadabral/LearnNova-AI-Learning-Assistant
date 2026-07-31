import React from 'react'
import { Link } from 'react-router-dom'
import { Play, BarChart2, Trash2, Award, BookOpen } from 'lucide-react'
import moment from 'moment'

const QuizCard = ({ quiz, onDelete }) => {
    return (
        <div className="group relative bg-gradient-to-br from-white via-violet-50/40 to-blue-50/40 backdrop-blur-xl border-2 border-slate-200 hover:border-violet-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-200/40 flex flex-col justify-between overflow-hidden">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(quiz);
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-70 hover:opacity-100"
            >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
            </button>

            <div className="space-y-4 pt-4">
                {moment(quiz.createdAt).isAfter(moment().subtract(3, "days")) && (
                    <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white text-[10px] font-bold uppercase shadow">
                        NEW
                    </div>
                )}
                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 py-1 rounded-lg text-xs font-semibold">
                    <div
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1 border ${quiz?.userAnswers?.length > 0
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-amber-50 border-amber-200"
                            }`}
                    >
                        <Award
                            className={`w-3.5 h-3.5 ${quiz?.userAnswers?.length > 0
                                    ? "text-emerald-600"
                                    : "text-amber-600"
                                }`}
                            strokeWidth={2.5}
                        />
                        <span className={
                            quiz?.userAnswers?.length > 0
                                ? "text-emerald-700"
                                : "text-amber-700"
                        }>
                            {quiz?.userAnswers?.length > 0
                                ? `Score: ${quiz.score ?? 0}%`
                                : "Not Attempted"}
                        </span>
                    </div>
                </div>

                <div>
                    <h3
                        className="text-base font-semibold text-slate-900 mb-1 line-clamp-2"
                        title={quiz.title}
                    >
                        {quiz.title ||
                            `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
                    </h3>

                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Created {moment(quiz.createdAt).format("MMM D, YYYY")}
                    </p>
                </div>

                {/* Quiz Info */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200">
                        <div className="flex items-center gap-2">

                            <BookOpen
                                className="w-4 h-4 text-violet-600"
                                strokeWidth={2}
                            />

                            <span className="text-sm font-semibold text-violet-700">
                                {quiz.questions?.length || 0}{" "}
                                {(quiz.questions?.length || 0) === 1 ? "Question" : "Questions"}
                            </span>

                        </div>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-2 pt-4 border-t border-slate-100">
                {quiz?.userAnswers?.length > 0 ? (
                    <Link to={`/quizzes/${quiz._id}/results`}>
                        <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer">
                            <BarChart2
                                className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200"
                                strokeWidth={2.5}
                            />
                            View Results
                        </button>
                    </Link>
                ) : (
                    <Link to={`/quizzes/${quiz._id}`}>
                        <button className="group/btn relative w-full h-11 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Play
                                    className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-200"
                                    strokeWidth={2.5}
                                />
                                Start Quiz
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default QuizCard;