import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';
import progressService from '../../services/progressService';
import WeeklyAnalytics from "../../components/dashboard/WeeklyAnalytics";
import toast from 'react-hot-toast';
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Dashboard Data:", data);
        setDashboardData(data.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Recently";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Recently";
    return parsed.toLocaleDateString([], {
      day: "numeric",
      month: "short"
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) return <Spinner />;

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 text-sm">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: 'from-blue-400 to-cyan-500',
      shadowColor: 'shadow-blue-500/25'
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-purple-500/25'
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(#dbeafe_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 p-8 mb-8">

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 mb-2">
                LearnNova
              </p>

              <h1 className="text-4xl font-bold text-slate-900">
                Welcome Back
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600 leading-7">
                Continue learning smarter with AI-generated summaries,
                flashcards and quizzes. Track your progress and keep improving every day.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/documents")}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                Upload PDF
              </button>

              <button
                onClick={() => navigate("/flashcards")}
                className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-semibold text-slate-700 transition"
              >
                Review Flashcards
              </button>
            </div>

          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </span>

                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadowColor} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="mt-3 text-4xl font-bold text-slate-900">
                  {stat.value}
                </div>

              </div>
            );
          })}
        </div>


        <WeeklyAnalytics />

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 p-6 mt-6">

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Clock className="w-6 h-6 text-slate-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Recent Learning Activity
                </h3>

                <p className="text-sm text-slate-500">
                  Your latest documents and quizzes
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/activity")}
              className="text-sm font-semibold text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition"
            >
              View All
            </button>

          </div>


          {dashboardData.recentActivity &&
            (
              (dashboardData.recentActivity.documents?.length || 0) > 0 ||
              (dashboardData.recentActivity.quizzes?.length || 0) > 0
            ) ? (

            <div className="space-y-4">

              {[
                ...(dashboardData.recentActivity.documents || []).map(doc => ({
                  id: doc._id,
                  description: doc.title || "Document",
                  timestamp: doc.lastAccessed || doc.updatedAt || doc.createdAt,
                  link: `/documents/${doc._id}`,
                  type: "document"
                })),

                ...(dashboardData.recentActivity.quizzes || []).map(quiz => ({
                  id: quiz._id,
                  description: quiz.title || "Quiz",
                  timestamp:
                    quiz.lastAttempted ||
                    quiz.attemptedAt ||
                    quiz.updatedAt ||
                    quiz.createdAt,
                  link: `/quizzes/${quiz._id}`,
                  type: "quiz"
                }))
              ]
                .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
                .slice(0, 5)
                .map((activity, index) => (

                  <div
                    key={activity.id || index}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 px-6 py-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${activity.type === "document"
                          ? "bg-blue-100"
                          : "bg-emerald-100"
                          }`}
                      >

                        {
                          activity.type === "document"
                            ?
                            <FileText className="w-6 h-6 text-blue-600" />
                            :
                            <BrainCircuit className="w-6 h-6 text-emerald-600" />
                        }

                      </div>


                      <div>

                        <h4 className="text-base font-semibold text-slate-900">
                          {activity.description}
                        </h4>

                        <p className="text-sm text-slate-500 mt-1">
                          {
                            activity.type === "document"
                              ? "Document opened"
                              : "Quiz attempted"
                          }
                        </p>

                      </div>

                    </div>


                    <div className="flex items-center gap-6">

                      <div className="text-right">

                        <p className="text-sm font-medium text-slate-700">
                          {formatDate(activity.timestamp)}
                        </p>

                        <p className="text-xs text-slate-400">
                          {formatTime(activity.timestamp)}
                        </p>

                      </div>


                      <button
                        onClick={() => navigate(activity.link)}
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition"
                      >
                        View
                        <ArrowRight className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                ))}

            </div>

          ) : (

            <div className="text-center py-16">

              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>

              <p className="text-sm text-slate-600">
                No recent activity yet.
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Upload a PDF to generate AI summaries, quizzes and flashcards.
              </p>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;