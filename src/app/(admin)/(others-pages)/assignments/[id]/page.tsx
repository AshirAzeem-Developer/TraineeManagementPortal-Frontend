'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import assignmentService from '@/lib/api/assignment.service';
import { Assignment, Submission } from '@/types';
import { toast } from 'react-hot-toast';

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const assignmentId = Number(params.id);

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [mySubmission, setMySubmission] = useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Submission form state
  const [submissionData, setSubmissionData] = useState({
    code_submission: '',
    github_url: '',
    live_url: '',
    notes: '',
    file: null as File | null,
  });

  const isTrainee = user?.role === 'trainee';
  const isTrainerOrAdmin = user?.role === 'trainer' || user?.role === 'admin';

  useEffect(() => {
    loadAssignmentData();
  }, [assignmentId]);

  const loadAssignmentData = async () => {
    try {
      setLoading(true);
      const assignmentData = await assignmentService.getAssignment(assignmentId);
      setAssignment(assignmentData);

      if (isTrainee) {
        const submission = await assignmentService.getMySubmission(assignmentId);
        setMySubmission(submission);
        
        if (submission) {
          setSubmissionData({
            code_submission: submission.code_submission || '',
            github_url: submission.github_url || '',
            live_url: submission.live_url || '',
            notes: submission.notes || '',
            file: null,
          });
        }
      } else if (isTrainerOrAdmin) {
        const submissionsData = await assignmentService.getAssignmentSubmissions(assignmentId);
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : submissionsData.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!submissionData.code_submission && !submissionData.github_url && !submissionData.file) {
      toast.error('Please provide at least one: code submission, GitHub URL, or file upload');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      
      if (submissionData.code_submission) {
        formData.append('code_submission', submissionData.code_submission);
      }
      if (submissionData.github_url) {
        formData.append('github_url', submissionData.github_url);
      }
      if (submissionData.live_url) {
        formData.append('live_url', submissionData.live_url);
      }
      if (submissionData.notes) {
        formData.append('notes', submissionData.notes);
      }
      if (submissionData.file) {
        formData.append('file', submissionData.file);
      }

      await assignmentService.submitAssignment(assignmentId, formData);
      toast.success('Assignment submitted successfully!');
      loadAssignmentData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionData({ ...submissionData, file: e.target.files[0] });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Assignment not found</p>
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
          ← Back to Assignments
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {assignment.title}
            </h1>
            <div className="flex gap-2 mt-2">
              <span className={`px-3 py-1 text-sm rounded-full ${
                assignment.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                assignment.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {assignment.difficulty}
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                {assignment.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          
          {isTrainerOrAdmin && (
            <button
              onClick={() => router.push(`/assignments/${assignment.id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Assignment
            </button>
          )}
        </div>
      </div>

      {/* Assignment Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {assignment.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Details</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>🎯 Max Score: {assignment.max_score}</li>
              {assignment.due_date && (
                <li>⏰ Due Date: {new Date(assignment.due_date).toLocaleDateString()}</li>
              )}
              {assignment.week && (
                <li>📅 Week {assignment.week.week_number}: {assignment.week.title}</li>
              )}
              {assignment.day && (
                <li>📖 Day {assignment.day.day_number}: {assignment.day.title}</li>
              )}
            </ul>
          </div>

          {assignment.requirements && assignment.requirements.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {assignment.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {assignment.resources && assignment.resources.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Resources</h3>
            <ul className="space-y-1">
              {assignment.resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Trainee: Submission Form */}
      {isTrainee && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {mySubmission ? 'Your Submission' : 'Submit Assignment'}
          </h2>

          {mySubmission && mySubmission.status === 'graded' && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">
                    Score: {mySubmission.score}/{assignment.max_score}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {((mySubmission.score! / assignment.max_score) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              {mySubmission.feedback && (
                <div className="mt-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Feedback:</p>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{mySubmission.feedback}</p>
                </div>
              )}
            </div>
          )}

          {mySubmission && mySubmission.status === 'resubmit' && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                Resubmission Required
              </p>
              {mySubmission.feedback && (
                <p className="text-yellow-700 dark:text-yellow-400 mt-1">{mySubmission.feedback}</p>
              )}
            </div>
          )}

          {(!mySubmission || mySubmission.status === 'resubmit') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code Submission
                </label>
                <textarea
                  value={submissionData.code_submission}
                  onChange={(e) => setSubmissionData({ ...submissionData, code_submission: e.target.value })}
                  rows={8}
                  placeholder="Paste your code here..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={submissionData.github_url}
                  onChange={(e) => setSubmissionData({ ...submissionData, github_url: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Live URL (Optional)
                </label>
                <input
                  type="url"
                  value={submissionData.live_url}
                  onChange={(e) => setSubmissionData({ ...submissionData, live_url: e.target.value })}
                  placeholder="https://your-project.vercel.app"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload File (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={submissionData.notes}
                  onChange={(e) => setSubmissionData({ ...submissionData, notes: e.target.value })}
                  rows={3}
                  placeholder="Any additional notes or comments..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : mySubmission ? 'Resubmit' : 'Submit Assignment'}
              </button>
            </form>
          )}

          {mySubmission && mySubmission.status === 'submitted' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300">
                Your submission has been received and is awaiting grading.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Trainer/Admin: Submissions List */}
      {isTrainerOrAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Submissions ({submissions.length})
          </h2>

          {submissions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No submissions yet</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {submission.user?.name || 'Unknown Student'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Submitted: {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                      submission.status === 'resubmit' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {submission.status.toUpperCase()}
                    </span>
                  </div>

                  {submission.score !== null && (
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Score: {submission.score}/{assignment.max_score}
                    </p>
                  )}

                  <button
                    onClick={() => router.push(`/submissions/${submission.id}/review`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Review Submission
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}