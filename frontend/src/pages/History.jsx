import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  Calendar,
  Trash2,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await api.get('/predictions/history/');
      setHistory(res.data);
    } catch (err) {
      setError('Failed to fetch prediction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prediction record?')) return;
    try {
      await api.delete(`/predictions/history/${id}/`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete history item.');
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Prediction History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your past placement calculations and track how profile updates impacted your probability
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
        >
          <span>New Prediction</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Predictions Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't run any placement predictions yet. Start by analyzing your current profile credentials!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline pt-2"
          >
            Run Your First Prediction &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header: Date & Delete */}
                <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete record"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Score & Candidate Name */}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.student_name}</h3>
                    <p className="text-xs text-slate-500">{item.stream_name}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600">
                      {item.placement_chance}%
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Chance
                    </span>
                  </div>
                </div>

                {/* Badges Profile Specs */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">CGPA</span>
                    <span className="font-bold text-slate-800 text-sm">{item.cgpa}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Backlogs</span>
                    <span className="font-bold text-slate-800 text-sm">{item.backlogs}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Projects</span>
                    <span className="font-bold text-slate-800 text-sm">{item.projects}</span>
                  </div>
                </div>

                {/* Tier 1 Flag */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">Tier 1 Eligibility:</span>
                  {item.tier1_eligible ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Eligible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3.5 h-3.5" />
                      Not Met
                    </span>
                  )}
                </div>

                {/* Skills tags */}
                {item.skills && (
                  <div className="mt-3">
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      <strong className="text-slate-700">Skills:</strong> {item.skills}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
