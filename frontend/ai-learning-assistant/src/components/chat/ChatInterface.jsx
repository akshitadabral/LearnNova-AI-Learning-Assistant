import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(
        documentId,
        userMessage.content
      );

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks,
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-4 ${
          isUser ? "justify-end" : ""
        }`}
      >
        {!isUser && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        )}

        <div
          className={`max-w-lg p-4 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-white border border-slate-200 text-slate-900 rounded-br-md shadow-sm'
              : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-slate">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20 shrink-0">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };


   if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-blue-600" />
        </div>
        <Spinner />
        <p className="text-sm text-slate-500 mt-3 font-medium">
          Loading chat history...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              LearnNova AI
            </h3>
            <p className="text-xs text-slate-500">
              Ask questions about this document
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/10">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Ask LearnNova AI
            </h3>

            <p className="text-sm text-slate-500 max-w-sm">
              Get explanations, summaries, examples and answers directly from your uploaded study material.
            </p>

          </div>
        ) : (
          history.map(renderMessage)
        )}

        <div ref={messagesEndRef} />

        {loading && (
          <div className="flex items-center gap-3 my-4">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200">

              <span
                className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />

              <span
                className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />

              <span
                className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />

            </div>

          </div>
        )}

      </div>

      {/* Input */}
      <div className="p-5 border-t border-slate-200 bg-white">

        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3"
        >

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything about your study material..."
            disabled={loading}
            className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-300 to-indigo-400 hover:from-blue-700 hover:to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>

        </form>

      </div>

    </div>
  );
};

export default ChatInterface;