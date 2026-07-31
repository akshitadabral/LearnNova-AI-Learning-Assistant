import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen
} from 'lucide-react';

const QuizResultPage = () => {
  const { quizId } = useParams();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }


  if (!results?.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600 text-lg">
          Quiz results not found.
        </p>
      </div>
    );
  }


  const { quiz, results: detailedResults = [] } = results.data;

  const score = quiz.score || 0;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;


  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };


  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good work!';
    if (score >= 60) return 'Not bad!';
    return 'Keep practicing!';
  };


  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-br from-white via-blue-50/30 to-violet-50/40 rounded-3xl p-8 shadow-xl shadow-slate-200/50">

      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document?._id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Document
        </Link>
      </div>


      <PageHeader title={`${quiz.title || 'Quiz'} Result`} />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Quiz Completed !
        </h2>

        <p className="text-slate-500 mt-2">
          Review your performance and learn from every answer.
        </p>
      </div>


      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl p-8 mb-8">

        <div className="text-center space-y-6">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100">
            <Trophy className="w-7 h-7 text-emerald-600" />
          </div>


          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase">
              Your Score
            </p>

            <div className={`text-5xl font-bold bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
              {score}%
            </div>

            <div className="mt-4 inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200">
              <span className="font-semibold text-violet-700">
                {score >= 90
                  ? "🏆 Outstanding"
                  : score >= 80
                    ? "⭐ Excellent"
                    : score >= 70
                      ? "👏 Good Work"
                      : score >= 60
                        ? "👍 Keep Going"
                        : "📚 Practice More"}
              </span>
            </div>
            <div className="mt-6">

              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Overall Performance</span>
                <span>{score}%</span>
              </div>

              <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">

                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-700`}
                  style={{ width: `${score}%` }}
                />

              </div>

            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">

            <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 p-4 border border-violet-200">
              <p className="text-xs text-slate-500">
                Total Questions
              </p>

              <h3 className="text-2xl font-bold text-violet-700">
                {totalQuestions}
              </h3>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 p-4 border border-emerald-200">
              <p className="text-xs text-slate-500">
                Correct
              </p>

              <h3 className="text-2xl font-bold text-emerald-700">
                {correctAnswers}
              </h3>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 p-4 border border-rose-200">
              <p className="text-xs text-slate-500">
                Incorrect
              </p>

              <h3 className="text-2xl font-bold text-rose-700">
                {incorrectAnswers}
              </h3>
            </div>

          </div>

        </div>
      </div>


      <div className="space-y-6">

        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-lg font-semibold">
            Question-by-Question Analysis
          </h3>
        </div>


        {detailedResults.map((result, index) => {

          const userAnswerIndex = result.options.findIndex(
            opt => opt === result.selectedAnswer
          );

          const correctAnswerIndex = result.options.findIndex(
            opt => opt === result.correctAnswer
          );


          return (
            <div
              key={index}
              className="bg-white/80 border-2 border-slate-200 rounded-2xl p-6 shadow-lg"
            >

              <div className="flex justify-between items-center mb-5">

                <h4 className="font-semibold text-lg">
                  Question {index + 1}
                </h4>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${result.isCorrect
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                    }`}
                >
                  {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>

              </div>

              <p className="font-medium mb-4">
                {result.question}
              </p>


              <div className="space-y-3">

                {result.options.map((option, optIndex) => {

                  const correct = optIndex === correctAnswerIndex;
                  const wrong = userAnswerIndex === optIndex && !correct;


                  return (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg border-2 ${correct
                        ? "bg-emerald-50 border-emerald-300"
                        : wrong
                          ? "bg-rose-50 border-rose-300"
                          : "bg-slate-50 border-slate-200"
                        }`}
                    >

                      <div className="flex justify-between">

                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
        ${correct
                              ? "bg-emerald-500 text-white"
                              : wrong
                                ? "bg-rose-500 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </div>

                          <span>{option}</span>
                        </div>

                        <div className="flex items-center gap-2">

                          <div className="flex items-center gap-2">

                            {correct && (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-medium text-emerald-700">
                                  Correct Answer
                                </span>
                              </>
                            )}

                            {wrong && (
                              <>
                                <XCircle className="w-4 h-4 text-rose-600" />
                                <span className="text-xs font-medium text-rose-700">
                                  Your Answer
                                </span>
                              </>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>
                  );

                })}

              </div>


              {result.explanation && (
                <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <p className="text-sm font-semibold text-blue-700">
                      Explanation
                    </p>
                  </div>

                  <p className="text-sm text-slate-700">
                    {result.explanation}
                  </p>
                </div>
              )}

            </div>
          );

        })}

      </div>


      <div className="mt-8 flex justify-center">

        <Link to={`/documents/${quiz.document?._id}`}>
          <button className="group px-8 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95">
            <ArrowLeft className="inline w-4 h-4 mr-2" />
            Return to Document
          </button>
        </Link>

      </div>


    </div>
  );
};


export default QuizResultPage;