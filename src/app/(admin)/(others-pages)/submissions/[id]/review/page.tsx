'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import assignmentService from '@/lib/api/assignment.service';
import evaluationService from '@/lib/api/evaluation.service';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { Evaluation, RubricScore } from '@/types';

export default function ReviewSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const submissionId = parseInt(params.id as string);

  const [overrides, setOverrides] = useState<Record<string, RubricScore>>({});
  const [overallFeedback, setOverallFeedback] = useState('');

  // Fetch submission
  const { data: submission, isLoading: submissionLoading } = useQuery({
    queryKey: ['submission-detail', submissionId],
    queryFn: async () => {
      // This would need a new endpoint or we fetch from assignment detail
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`, {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('auth_token=')[1]?.split(';')[0]}`,
        },
      });
      return response.json();
    },
  });

  // Fetch evaluation
  const { data: evaluation, isLoading: evaluationLoading } = useQuery({
    queryKey: ['evaluation', submissionId],
    queryFn: () => evaluationService.getEvaluation(submissionId),
    enabled: !!submission,
  });

  // Initialize overrides from evaluation
  useEffect(() => {
    if (evaluation?.rubric_scores) {
      setOverrides(evaluation.rubric_scores);
      setOverallFeedback(evaluation.overall_feedback || '');
    }
  }, [evaluation]);

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: (data: any) => evaluationService.reviewEvaluation(evaluation!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation', submissionId] });
      alert('Review submitted successfully!');
      router.back();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to submit review');
    },
  });

  const handleScoreChange = (rubricName: string, newScore: number) => {
    setOverrides({
      ...overrides,
      [rubricName]: {
        ...overrides[rubricName],
        score: newScore,
      },
    });
  };

  const handleFeedbackChange = (rubricName: string, newFeedback: string) => {
    setOverrides({
      ...overrides,
      [rubricName]: {
        ...overrides[rubricName],
        feedback: newFeedback,
      },
    });
  };

  const handleSubmitReview = () => {
    reviewMutation.mutate({
      rubric_overrides: overrides,
      overall_feedback: overallFeedback,
    });
  };

  if (submissionLoading || evaluationLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div>
        <PageBreadCrumb pageTitle="Review Submission" />
        <div className="rounded-lg border border-stroke bg-white p-8 text-center shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-dark-5 dark:text-dark-6">No evaluation found for this submission</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadCrumb pageTitle="Review Submission" />

      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">
          Review AI Evaluation
        </h1>

        {/* AI Overall Score */}
        <div className="mb-6 rounded-lg bg-gray-2 p-4 dark:bg-dark-2">
          <p className="text-sm text-dark-5 dark:text-dark-6">AI Generated Score</p>
          <p className="text-2xl font-bold text-primary">
            {evaluation.total_score}/{evaluation.max_possible_score} ({evaluation.percentage}%)
          </p>
        </div>

        {/* Rubric Score Adjustments */}
        <div className="space-y-6">
          {Object.entries(overrides).map(([rubricName, data]) => (
            <div key={rubricName} className="rounded-lg border border-stroke p-4 dark:border-dark-3">
              <h3 className="mb-3 font-semibold text-dark dark:text-white">{rubricName}</h3>

              {/* Score Slider */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-dark-5 dark:text-dark-6">
                  Score: {data.score}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={data.score}
                  onChange={(e) => handleScoreChange(rubricName, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-dark-5 dark:text-dark-6">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="mb-2 block text-sm font-medium text-dark-5 dark:text-dark-6">
                  Feedback
                </label>
                <textarea
                  value={data.feedback}
                  onChange={(e) => handleFeedbackChange(rubricName, e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  placeholder="Additional feedback..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* Overall Feedback Override */}
        <div className="mt-6">
          <label className="mb-2 block font-medium text-dark dark:text-white">
            Overall Feedback (Optional Override)
          </label>
          <textarea
            value={overallFeedback}
            onChange={(e) => setOverallFeedback(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            placeholder="Provide overall feedback..."
          />
        </div>

        {/* Submit Review */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-stroke px-6 py-3 font-medium hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={reviewMutation.isPending}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}