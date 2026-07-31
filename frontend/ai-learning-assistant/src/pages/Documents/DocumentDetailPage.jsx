import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';
import ChatInterface from '../../components/chat/ChatInterface';
import AIActions from '../../components/ai/AIActions';
import FlashcardManager from '../../components/flashcards/FlashcardManager';
import QuizManager from '../../components/quizzes/QuizManager';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content');

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error('Failed to fetch document details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // Helper function to get the full PDF URL
  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    if (
      filePath.startsWith('http://') ||
      filePath.startsWith('https://')
    ) {
      return filePath;
    }

    const baseUrl =
      process.env.REACT_APP_API_URL || 'http://localhost:8000';

    return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document || !document.data || !document.data.filePath) {
      return <div className="text-center p-8">This study material couldn't be loaded.</div>;
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div>

            <p className="font-semibold text-slate-800">
              Reading Mode
            </p>

            <p className="text-sm text-slate-500">
              Preview your uploaded document
            </p>

          </div>

        </div>

        <div className="bg-slate-100 p-3">
          <iframe
            src={pdfUrl}
            className="w-full h-[78vh] rounded-xl bg-white border border-gray-300"
            title="PDF Viewer"
            frameBorder="0"
            style={{
              colorScheme: 'light',
            }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />
  };

  const renderAIActions = () => {
    return <AIActions />;
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />
  };

  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: renderChat() },
    { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
    {
      name: 'Flashcards',
      label: 'Flashcards',
      content: renderFlashcardsTab(),
    },
    {
      name: 'Quizzes',
      label: 'Quizzes',
      content: renderQuizzesTab(),
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return <div className="text-center p-8">Study material not found.</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 font-medium transition"
        >
          <ArrowLeft size={16} />
          Back to Library
        </Link>


      </div>
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/40 p-8">

        <div className="space-y-8">

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            <div>
              <p className="uppercase tracking-widest text-xs font-semibold text-emerald-600 mb-2">
                LearnNova Library
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                {document.data.title}
              </h1>

              <p className="mt-2 text-slate-500">
                Read, chat, summarize and test yourself using AI.
              </p>
            </div>

            <a
              href={getPdfUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              Open PDF
            </a>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Status
              </p>

              <p className="mt-2 text-lg font-semibold capitalize text-emerald-600">
                {document.data.status}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Flashcards
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {document.data.flashcardCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Quizzes
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {document.data.quizCount}
              </p>
            </div>

          </div>

        </div>
        <div className="mt-8">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  )
};

export default DocumentDetailPage;