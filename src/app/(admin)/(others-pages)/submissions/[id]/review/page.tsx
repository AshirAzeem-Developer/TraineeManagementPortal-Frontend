'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import assignmentService from '@/lib/api/assignment.service';
import { Submission, Evaluation } from '@/types';
import { toast } from 'react-hot-toast';

export default function SubmissionReviewPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = Number(params.id);

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [gradeData, setGradeData] = useState({
    score: 0,
    feedback: '',
    status: 'graded' as 'graded' | 'resubmit',
  });

  useEffect(() => {
    loadSubmissionData();
  }, [submissionId]);

  const loadSubmissionData = async () => {
    try {
      setLoading(true);
      const submissionData = await assignmentService.getSubmission(submissionId);
      setSubmission(submissionData);

      // Load evaluation if exists
      const evalData = await assignmentService.getSubmissionEvaluation(submissionId);
      setEvaluation(evalData);

      // Pre-fill grade data if already graded
      if (submissionData.score !== null) {
        setGradeData({
          score: submissionData.score,
          feedback: submissionData.feedback || '',
          status: submissionData.status as 'graded' | 'resubmit',
        });
      } else if (submissionData.assignment) {
        setGradeData(prev => ({
          ...prev,
          score: Math.round(submissionData.assignment!.max_score * 0),
        }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load submission');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!submission?.assignment) return;

    if (gradeData.score < 0 || gradeData.score > submission.assignment.max_score) {
      toast.error(`Score must be between 0 and ${submission.assignment.max_score}`);
      return;
    }

    try {
      setGrading(true);
      await assignmentService.gradeSubmission(submissionId, gradeData);
      toast.success('Submission graded successfully!');
      loadSubmissionData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const handleAIEvaluation = async () => {
    try {
      setEvaluating(true);
      const evalResult = await assignmentService.evaluateSubmission(submissionId);
      setEvaluation(evalResult);
      
      // Auto-fill grade data from AI evaluation
      if (evalResult.total_score !== null && submission?.assignment) {
        setGradeData({
          score: evalResult.total_score,
          feedback: evalResult.overall_feedback || '',
          status: 'graded',
        });
      }
      
      toast.success('AI evaluation completed!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to evaluate submission');
    } finally {
      setEvaluating(false);
    }
  };

  const downloadFile = async () => {
    if (!submission?.file_path) return;
    
    try {
      const blob = await assignmentService.downloadSubmissionFile(submissionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = submission.file_path.split('/').pop() || 'submission';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast.error('Failed to download file');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Submission not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Review Submission
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {submission.assignment?.title}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Student Information
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Name:</strong> {submission.user?.name}</p>
              <p><strong>Email:</strong> {submission.user?.email}</p>
              <p><strong>Submitted:</strong> {new Date(submission.created_at).toLocaleString()}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                  submission.status === 'resubmit' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {submission.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Submission Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Submission Content
            </h2>

            {submission.code_submission && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Code:</h3>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{submission.code_submission}</code>
                </pre>
              </div>
            )}

            {submission.github_url && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">GitHub:</h3>
                <a
                  href={submission.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  {submission.github_url}
                </a>
              </div>
            )}

            {submission.live_url && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live URL:</h3>
                <a
                  href={submission.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  {submission.live_url}
                </a>
              </div>
            )}

            {submission.file_path && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">File:</h3>
                <button
                  onClick={downloadFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  📥 Download File
                </button>
              </div>
            )}

            {submission.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes:</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {submission.notes}
                </p>
              </div>
            )}
          </div>

          {/* AI Evaluation */}
          {evaluation && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                AI Evaluation
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI Score</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {evaluation.total_score}/{evaluation.max_possible_score}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {evaluation.percentage}%
                    </p>
                  </div>
                </div>

                {evaluation.overall_feedback && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Overall Feedback:
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {evaluation.overall_feedback}
                    </p>
                  </div>
                )}

                {evaluation.strengths && evaluation.strengths.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Strengths:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {evaluation.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.improvements && evaluation.improvements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Areas for Improvement:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {evaluation.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.rubric_scores && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Rubric Scores:
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(evaluation.rubric_scores).map(([criterion, data]) => (
                        <div key={criterion} className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{criterion}</span>
                            <span>{data.score}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {data.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Grading Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Grading
            </h2>

            {/* AI Evaluation Button */}
            {!evaluation && (
              <button
                onClick={handleAIEvaluation}
                disabled={evaluating}
                className="w-full mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {evaluating ? 'Evaluating...' : '🤖 AI Evaluation'}
              </button>
            )}

            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Score (Max: {submission.assignment?.max_score})
                </label>
                <input
                  type="number"
                  value={gradeData.score}
                  onChange={(e) => setGradeData({ ...gradeData, score: Number(e.target.value) })}
                  min="0"
                  max={submission.assignment?.max_score}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Percentage: {submission.assignment?.max_score 
                    ? ((gradeData.score / submission.assignment.max_score) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Feedback
                </label>
                <textarea
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  rows={6}
                  placeholder="Provide feedback to the student..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={gradeData.status}
                  onChange={(e) => setGradeData({ ...gradeData, status: e.target.value as 'graded' | 'resubmit' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="graded">Graded (Complete)</option>
                  <option value="resubmit">Request Resubmission</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={grading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {grading ? 'Saving...' : 'Save Grade'}
              </button>
            </form>

            {submission.score !== null && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  Previously graded: {submission.score}/{submission.assignment?.max_score}
                </p>
                {submission.graded_at && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {new Date(submission.graded_at).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}