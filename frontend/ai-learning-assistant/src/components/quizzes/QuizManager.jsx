import React, { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../services/quizService';
import aiService from '../../services/aiService';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import Modal from '../common/Modal';
import QuizCard from './QuizCard';
import EmptyState from '../common/EmptyState';

const QuizManager = ({ documentId }) => {

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [numQuestions, setNumQuestions] = useState(5);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const data = await quizService.getQuizzesForDocument(documentId);
            setQuizzes(data.data);
        }
        catch (error) {
            toast.error('Failed to fetch quizzes.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (documentId) {
            fetchQuizzes();
        }
    }, [documentId]);

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            await aiService.generateQuiz(documentId, { numQuestions });
            toast.success('Quiz generated successfully!');
            setIsGenerateModalOpen(false);
            fetchQuizzes();
        } catch (error) {
            toast.error(error.message || 'Failed to generate quiz.');
        } finally {
            setGenerating(false);
        }
    };

    const handleDeleteRequest = (quiz) => {
        setSelectedQuiz(quiz);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedQuiz) return;
        setDeleting(true);
        try {
            await quizService.deleteQuiz(selectedQuiz._id);
            toast.success(`'${selectedQuiz.title || 'Quiz'}' deleted.`);
            setIsDeleteModalOpen(false);
            setSelectedQuiz(null);
            setQuizzes(quizzes.filter(q => q._id !== selectedQuiz._id));
        } catch (error) {
            toast.error(error.message || 'Failed to delete quiz.');
        } finally {
            setDeleting(false);
        }

    };

    const renderQuizContent = () => {
        if (loading) {
            return <Spinner />;
        }
        if (quizzes.length === 0) {
            return (
                <div className="py-12">
                <EmptyState
                    title="Create Your First Quiz"
                    description="Generate an AI-powered quiz from your document to test your understanding."
                />
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {quizzes.map((quiz) => (
                    <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
                ))}
            </div>

        );


    };

    return (
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-violet-50/40 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 p-4 border border-violet-200">
                    <p className="text-xs text-slate-500">
                        Quizzes
                    </p>

                    <h3 className="text-2xl font-bold text-violet-700">
                        {quizzes.length}
                    </h3>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 p-4 border border-blue-200">
                    <p className="text-xs text-slate-500">
                        Questions
                    </p>

                    <h3 className="text-2xl font-bold text-blue-700">
                        {quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}
                    </h3>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 p-4 border border-pink-200">
                    <p className="text-xs text-slate-500">
                        AI Generated
                    </p>

                    <h3 className="text-2xl font-bold text-pink-700">
                        🤖
                    </h3>
                </div>

            </div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2">

                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">

                            <Sparkles
                                className="w-4 h-4 text-white"
                                strokeWidth={2}
                            />

                        </div>

                        <div>

                            <h3 className="text-lg font-semibold text-slate-900">
                                Quiz Library
                            </h3>

                            <p className="text-sm text-slate-500">
                                {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"} available
                            </p>

                        </div>

                    </div>

                </div>
                <Button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={16} />
                    Generate New Quiz
                </Button>
            </div>
            {renderQuizContent()}
            {/* Generate Quiz */}
            <Modal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                title="Generate New Quiz"
            >
                <form onSubmit={handleGenerateQuiz} className="space-y-6">
                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Number of Questions
                        </label>
                        <input
                            type="number"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            required
                            className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 transition-all"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsGenerateModalOpen(false)}
                            disabled={generating}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={generating}>
                            {generating ? 'Generating Quiz...' : 'Generate'}
                        </Button>
                    </div>
                </form>
            </Modal>
            {/* Delete Confirmation */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Quiz?"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-neutral-900">
                            {selectedQuiz?.title || "this quiz"}
                        </span>
                        ? This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500"
                        >
                            {deleting ? 'Deleting... ' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>




    )
}


export default QuizManager


