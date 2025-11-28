'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import assignmentService from '@/lib/api/assignment.service';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { Assignment } from '@/types';
import { format } from 'date-fns';

export default function AssignmentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedType, setSelectedType] = useState<string>('all');

  // Fetch assignments based on role
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', user?.role],
    queryFn: () => {
      if (user?.role === 'trainee') {
        return assignmentService.getMyAssignments();
      }
      return assignmentService.getAssignments({}).then(res => res.data);
    },
    enabled: !!user,
  });

  const getTypeBadge = (type: string) => {
    const colors = {
      mini_task: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      project: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      quiz: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      reading: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };

    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors[type as keyof typeof colors] || ''}`}>
        {type.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors[difficulty as keyof typeof colors] || ''}`}>
        {difficulty.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (assignment: Assignment) => {
    if (user?.role !== 'trainee') return null;

    const submission = assignment.my_submission;

    if (!submission) {
      return <span className="text-sm text-red-500 font-medium">Not Submitted</span>;
    }

    const colors = {
      submitted: 'text-blue-500',
      graded: 'text-green-500',
      resubmit: 'text-yellow-500',
    };

    return (
      <span className={`text-sm font-medium ${colors[submission.status as keyof typeof colors]}`}>
        {submission.status.toUpperCase()}
        {submission.status === 'graded' && submission.score !== null && (
          <span className="ml-2">({submission.score}/{assignment.max_score})</span>
        )}
      </span>
    );
  };

  const filteredAssignments = assignments?.filter((a: Assignment) =>
    selectedType === 'all' ? true : a.type === selectedType
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageBreadCrumb pageTitle="Assignments" />

        {user?.role !== 'trainee' && (
          <button
            onClick={() => router.push('/assignments/create')}
            className="rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90"
          >
            Create Assignment
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {['all', 'mini_task', 'project', 'quiz', 'reading'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-colors ${
              selectedType === type
                ? 'bg-primary text-white'
                : 'bg-gray-2 text-dark hover:bg-gray-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3'
            }`}
          >
            {type === 'all' ? 'All' : type.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Assignments Grid */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : filteredAssignments?.length === 0 ? (
        <div className="rounded-lg border border-stroke bg-white p-8 text-center shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-dark-5 dark:text-dark-6">No assignments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssignments?.map((assignment: Assignment) => (
            <div
              key={assignment.id}
              className="cursor-pointer rounded-lg border border-stroke bg-white p-6 shadow-default transition-shadow hover:shadow-lg dark:border-dark-3 dark:bg-gray-dark"
              onClick={() => router.push(`/assignments/${assignment.id}`)}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex gap-2">
                  {getTypeBadge(assignment.type)}
                  {getDifficultyBadge(assignment.difficulty)}
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                {assignment.title}
              </h3>

              <p className="mb-4 line-clamp-2 text-sm text-dark-5 dark:text-dark-6">
                {assignment.description}
              </p>

              <div className="space-y-2 text-sm text-dark-5 dark:text-dark-6">
                {assignment.week && (
                  <div>
                    <span className="font-medium">Week:</span> {assignment.week.week_number} - {assignment.week.title}
                  </div>
                )}

                {assignment.day && (
                  <div>
                    <span className="font-medium">Day:</span> {assignment.day.day_number} - {assignment.day.title}
                  </div>
                )}

                {assignment.due_date && (
                  <div>
                    <span className="font-medium">Due:</span> {format(new Date(assignment.due_date), 'MMM dd, yyyy')}
                  </div>
                )}

                <div>
                  <span className="font-medium">Max Score:</span> {assignment.max_score}
                </div>
              </div>

              {user?.role === 'trainee' && (
                <div className="mt-4 border-t border-stroke pt-4 dark:border-dark-3">
                  {getStatusBadge(assignment)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}