'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import assignmentService from '@/lib/api/assignment.service';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import TextArea from '@/components/form/input/TextArea';
import InputField from '@/components/form/input/InputField';
import { format } from 'date-fns';
import evaluationService from '@/lib/api/evaluation.service';
import { Evaluation } from '@/types';

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const assignmentId = parseInt(params.id as string);


  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
const [evaluating, setEvaluating] = useState(false);

  const [submissionData, setSubmissionData] = useState({
    code_submission: '',
    github_url: '',
    live_url: '',
    notes: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch assignment
  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: () => assignmentService.getAssignment(assignmentId),
  });

  // Submit assignment mutation
  const submitMutation = useMutation({
    mutationFn: (data: FormData) => assignmentService.submitAssignment(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] });
      alert('Assignment submitted successfully!');
      setSubmissionData({ code_submission: '', github_url: '', live_url: '', notes: '' });
      setSelectedFile(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to submit assignment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (submissionData.code_submission) formData.append('code_submission', submissionData.code_submission);
    if (submissionData.github_url) formData.append('github_url', submissionData.github_url);
    if (submissionData.live_url) formData.append('live_url', submissionData.live_url);
    if (submissionData.notes) formData.append('notes', submissionData.notes);
    if (selectedFile) formData.append('file', selectedFile);

    submitMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  const submission = assignment.my_submission;
// Fetch evaluation when submission exists
useEffect(() => {
  if (submission) {
    evaluationService.getEvaluation(submission.id).then(setEvaluation);
  }
}, [submission]);

// Trigger AI evaluation
const handleTriggerEvaluation = async () => {
  if (!submission) return;

  setEvaluating(true);
  try {
    const evaluation = await evaluationService.triggerEvaluation(submission.id);
    setEvaluation(evaluation);
    alert('AI Evaluation completed!');
  } catch (error: any) {
    alert(error.response?.data?.message || 'Evaluation failed');
  } finally {
    setEvaluating(false);
  }
};
  return (
    <div>
      <PageBreadCrumb pageTitle={assignment.title} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Assignment Details */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-dark dark:text-white">
                {assignment.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {assignment.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {assignment.difficulty.toUpperCase()}
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  Max Score: {assignment.max_score}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                Description
              </h3>
              <p className="text-dark-5 dark:text-dark-6 whitespace-pre-wrap">
                {assignment.description}
              </p>
            </div>

            {assignment.requirements && assignment.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                  Requirements
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-dark-5 dark:text-dark-6">
                  {assignment.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {assignment.resources && assignment.resources.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                  Resources
                </h3>
                <div className="space-y-2">
                  {assignment.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:underline"
                    >
                      {resource}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {assignment.due_date && (
              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Due Date: {format(new Date(assignment.due_date), 'MMMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>

          {/* Submission Form (Trainee Only) */}
          {user?.role === 'trainee' && (
            <div className="mt-6 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white">
                {submission ? 'Update Submission' : 'Submit Assignment'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <TextArea
                  label="Code Submission"
                  value={submissionData.code_submission}
                  onChange={(value) => setSubmissionData({ ...submissionData, code_submission: value })}
                  placeholder="Paste your code here..."
                  rows={10}
                />

                <div>
                  <label className="mb-2.5 block font-medium text-dark dark:text-white">
                    Upload File (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                  />
                </div>

                <InputField
                  label="GitHub URL (Optional)"
                  type="url"
                  value={submissionData.github_url}
                  onChange={(e) => setSubmissionData({ ...submissionData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                />

                <InputField
                  label="Live URL (Optional)"
                  type="url"
                  value={submissionData.live_url}
                  onChange={(e) => setSubmissionData({ ...submissionData, live_url: e.target.value })}
                  placeholder="https://..."
                />

                <TextArea
                  label="Notes (Optional)"
                  value={submissionData.notes}
                  onChange={(value) => setSubmissionData({ ...submissionData, notes: value })}
                  placeholder="Any additional notes..."
                  rows={4}
                />

                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                >
                  {submitMutation.isPending ? 'Submitting...' : (submission ? 'Update Submission' : 'Submit Assignment')}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar - Submission Status */}
        <div>
          {submission && user?.role === 'trainee' && (
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
              <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                Your Submission
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-dark-5 dark:text-dark-6">Status</p>
                  <p className="font-medium text-dark dark:text-white capitalize">
                    {submission.status}
                  </p>
                </div>

                {submission.score !== null && (
                  <div>
                    <p className="text-sm text-dark-5 dark:text-dark-6">Score</p>
                    <p className="text-2xl font-bold text-primary">
                      {submission.score}/{assignment.max_score}
                    </p>
                  </div>
                )}

                {submission.feedback && (
                  <div>
                    <p className="text-sm text-dark-5 dark:text-dark-6">Feedback</p>
                    <p className="mt-1 whitespace-pre-wrap text-dark dark:text-white">
                      {submission.feedback}
                    </p>
                  </div>
                )}

                {submission.github_url && (
                  <div>
                    <p className="text-sm text-dark-5 dark:text-dark-6">GitHub</p>
                    <a
                      href={submission.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Repository
                    </a>
                  </div>
                )}

                {submission.live_url && (
                  <div>
                    <p className="text-sm text-dark-5 dark:text-dark-6">Live Demo</p>
                    <a 
                      href={submission.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Live
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-sm text-dark-5 dark:text-dark-6">Submitted</p>
                  <p className="text-dark dark:text-white">
                    {format(new Date(submission.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* AI Evaluation Results */}
{submission && evaluation && user?.role === 'trainee' && (
  <div className="mt-6 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
    <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
      AI Evaluation
    </h3>

    {/* Overall Score */}
    <div className="mb-6 rounded-lg bg-primary/10 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-5 dark:text-dark-6">Total Score</p>
          <p className="text-3xl font-bold text-primary">
            {evaluation.total_score}/{evaluation.max_possible_score}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-dark-5 dark:text-dark-6">Percentage</p>
          <p className="text-3xl font-bold text-primary">{evaluation.percentage}%</p>
        </div>
      </div>
    </div>

    {/* Overall Feedback */}
    {evaluation.overall_feedback && (
      <div className="mb-4">
        <p className="mb-2 font-medium text-dark dark:text-white">Overall Feedback</p>
        <p className="whitespace-pre-wrap text-sm text-dark-5 dark:text-dark-6">
          {evaluation.overall_feedback}
        </p>
      </div>
    )}

    {/* Strengths */}
    {evaluation.strengths && evaluation.strengths.length > 0 && (
      <div className="mb-4">
        <p className="mb-2 font-medium text-green-600 dark:text-green-400">Strengths</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-dark-5 dark:text-dark-6">
          {evaluation.strengths.map((strength, idx) => (
            <li key={idx}>{strength}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Improvements */}
    {evaluation.improvements && evaluation.improvements.length > 0 && (
      <div className="mb-4">
        <p className="mb-2 font-medium text-yellow-600 dark:text-yellow-400">
          Areas for Improvement
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-dark-5 dark:text-dark-6">
          {evaluation.improvements.map((improvement, idx) => (
            <li key={idx}>{improvement}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Rubric Scores Breakdown */}
    {evaluation.rubric_scores && (
      <div className="mt-6">
        <p className="mb-3 font-medium text-dark dark:text-white">Detailed Scores</p>
        <div className="space-y-3">
          {Object.entries(evaluation.rubric_scores).map(([rubricName, data]) => (
            <div key={rubricName} className="rounded-lg border border-stroke p-3 dark:border-dark-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium text-dark dark:text-white">{rubricName}</p>
                <p className="font-bold text-primary">{data.score}</p>
              </div>
              <p className="text-sm text-dark-5 dark:text-dark-6">{data.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {evaluation.trainer_reviewed && (
      <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          ✓ Reviewed by trainer
        </p>
      </div>
    )}
  </div>
)}

{/* Trigger Evaluation Button (Trainer) */}
{user?.role !== 'trainee' && submission && !evaluation && (
  <div className="mt-6">
    <button
      onClick={handleTriggerEvaluation}
      disabled={evaluating}
      className="w-full rounded-lg bg-purple-500 px-6 py-3 font-medium text-white hover:bg-purple-600 disabled:opacity-50"
    >
      {evaluating ? 'Evaluating with AI...' : 'Trigger AI Evaluation'}
    </button>
  </div>
)}
      </div>
    </div>
  );
}