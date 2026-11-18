import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  PlusCircle,
  TrendingUp,
  Building2,
  ListChecks,
  Compass,
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Python',
  'DSA',
  'Java',
  'C++',
  'SQL',
  'Web Development',
  'React',
  'Django',
  'AI/ML',
  'Cloud',
  'DevOps',
  'Git',
];

export default function Dashboard() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    student_name: user?.username || 'Candidate',
    stream: user?.stream || 2,
    cgpa: user?.cgpa || 8.0,
    internships: 0,
    projects: 2,
    backlogs: 0,
    skills: 'Python, DSA, Web Development, SQL',
    project_name_1: 'E-Commerce Platform',
    project_domain_1: 'Web / Full-Stack',
    project_name_2: 'Placement Predictor System',
    project_domain_2: 'AI / Machine Learning',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddSkill = (skill) => {
    const current = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!current.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      const updated = [...current, skill].join(', ');
      setFormData((prev) => ({ ...prev, skills: updated }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/predictions/predict/', formData);
      setResult(res.data);
      // Sync CGPA if updated
      if (user && formData.cgpa !== user.cgpa) {
        updateUser({ ...user, cgpa: formData.cgpa, stream: formData.stream });
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Failed to compute placement prediction. Please check inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Color determination based on probability
  const getProbabilityColor = (chance) => {
    if (chance >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200' };
    if (chance >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', light: 'bg-amber-50 border-amber-200' };
    return { text: 'text-rose-600', bg: 'bg-rose-500', light: 'bg-rose-50 border-rose-200' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Driven Placement Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.first_name || user?.username}! 👋
          </h1>
          <p className="mt-1.5 text-indigo-100 text-sm max-w-xl">
            Evaluate your placement readiness, check tier-by-tier eligibility (Tier 1, Tier 2, Tier 3), and receive personalized recommendations.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
          <div className="text-center px-3">
            <div className="text-xs uppercase font-medium text-indigo-200">Stream</div>
            <div className="text-sm font-bold mt-0.5">
              {formData.stream === 2 ? 'Computer Science' : formData.stream === 3 ? 'IT' : 'Other'}
            </div>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center px-3">
            <div className="text-xs uppercase font-medium text-indigo-200">Current CGPA</div>
            <div className="text-sm font-bold mt-0.5">{formData.cgpa || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Profile Inputs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Customize your technical and academic credentials</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Candidate Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Stream */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Stream
              </label>
              <select
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={2}>Computer Science</option>
                <option value={3}>Information Technology</option>
                <option value={4}>Other Branch</option>
              </select>
            </div>

            {/* CGPA & Backlogs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  CGPA (0 - 10)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Active Backlogs
                </label>
                <select
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value={0}>0 Backlogs</option>
                  <option value={1}>1 Backlog</option>
                  <option value={2}>2 Backlogs</option>
                  <option value={3}>3+ Backlogs</option>
                </select>
              </div>
            </div>

            {/* Internships & Total Projects */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Internships
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  name="internships"
                  value={formData.internships}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Total Projects
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  name="projects"
                  value={formData.projects}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showcase Projects
              </span>

              {/* Primary Project */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="project_name_1"
                    placeholder="Primary Project Name"
                    value={formData.project_name_1}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    name="project_domain_1"
                    value={formData.project_domain_1}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Web / Full-Stack">Web / Full-Stack</option>
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Cloud / DevOps">Cloud / DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Secondary Project */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="project_name_2"
                    placeholder="Secondary Project (Optional)"
                    value={formData.project_name_2}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    name="project_domain_2"
                    value={formData.project_domain_2}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Web / Full-Stack">Web / Full-Stack</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Cloud / DevOps">Cloud / DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Technical Skills (Comma separated)
              </label>
              <textarea
                rows={2}
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Python, DSA, SQL, Web Development..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              {/* Quick tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTED_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 px-2 py-0.5 rounded-full transition"
                  >
                    <PlusCircle className="w-3 h-3 text-slate-400" />
                    <span>{skill}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Calculate Placement Probability</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Results & Tier Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <>
              {/* Score Highlight Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
                      Model Inference Result
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {result.student_name}’s Placement Readiness
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Status:{' '}
                      <span className="font-semibold text-slate-900">
                        {result.prediction === 1 ? 'High Likelihood of Campus Placement' : 'Risk Identified'}
                      </span>
                    </p>
                  </div>

                  {/* Probability Radial Gauge */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={`${getProbabilityColor(result.placement_chance).text}`}
                          strokeDasharray={`${result.placement_chance}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-2xl font-black text-slate-900">
                          {result.placement_chance}%
                        </span>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          Chance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {result.tip && (
                  <div className="mt-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{result.tip}</span>
                  </div>
                )}
              </div>

              {/* Company Tier Eligibility */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">Company Tier Eligibility</h3>
                </div>

                <div className="space-y-4">
                  {result.company_tiers?.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition ${
                        tier.eligible
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{tier.tier}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                              {tier.package}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{tier.companies}</p>
                          <p className="text-xs text-slate-500 pt-1 font-medium">{tier.reason}</p>
                        </div>

                        <div>
                          {tier.eligible ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Eligible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                              <XCircle className="w-3.5 h-3.5" />
                              Not Yet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Plan */}
              {result.action_plan && result.action_plan.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-2 mb-4">
                    <ListChecks className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">Personalized Career Action Plan</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {result.action_plan.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.title}</div>
                          <div className="text-xs font-semibold text-indigo-600 mt-0.5">
                            {item.boost}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State Guide */
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200/80 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Ready to Analyze</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Fill in your academic profile, completed internships, and project details on the left, then click{' '}
                <span className="font-semibold text-slate-800">"Calculate Placement Probability"</span> to view your machine learning tier forecast.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
