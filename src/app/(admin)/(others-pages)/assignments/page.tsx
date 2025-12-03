'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import assignmentService from '@/lib/api/assignment.service';
import { Assignment } from '@/types';
import { toast } from 'react-hot-toast';

export default function AssignmentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    difficulty: '',
    week_id: '',
    batch_id: '',
  });

  const isTrainee = user?.role === 'trainee';
  const isTrainerOrAdmin = user?.role === 'trainer' || user?.role === 'admin';

  useEffect(() => {
    loadAssignments();
  }, [filters]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = isTrainee
        ? await assignmentService.getMyAssignments()
        : await assignmentService.getAssignments();
      
      setAssignments(Array.isArray(data) ? data : data.data || []);
      console.log(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await assignmentService.deleteAssignment(id);
      toast.success('Assignment deleted successfully');
      loadAssignments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      await assignmentService.togglePublishStatus(id, !currentStatus);
      toast.success(`Assignment ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      loadAssignments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (assignment: Assignment) => {
    if (isTrainee && assignment.my_submission) {
      const status = assignment.my_submission.status;
      const colors = {
        submitted: 'bg-blue-100 text-blue-800',
        graded: 'bg-green-100 text-green-800',
        resubmit: 'bg-yellow-100 text-yellow-800',
        pending: 'bg-gray-100 text-gray-800',
      };
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${colors[status]}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      );
    }
    return null;
  };

  const getScoreBadge = (assignment: Assignment) => {
    if (isTrainee && assignment.my_submission?.score !== null) {
      const score = assignment?.my_submission?.score || 0;
      const percentage = (score / assignment.max_score) * 100;
      let colorClass = 'bg-red-100 text-red-800';
      if (percentage >= 80) colorClass = 'bg-green-100 text-green-800';
      else if (percentage >= 60) colorClass = 'bg-yellow-100 text-yellow-800';

      return (
        <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
          {score}/{assignment.max_score}
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isTrainee ? 'My Assignments' : 'Assignments'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isTrainee
              ? 'View and submit your assignments'
              : 'Manage assignments and track submissions'}
          </p>
        </div>
        {isTrainerOrAdmin && (
          <button
            onClick={() => router.push('/assignments/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Create Assignment
          </button>
        )}
      </div>

      {/* Filters */}
      {isTrainerOrAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="mini_task">Mini Task</option>
              <option value="project">Project</option>
              <option value="quiz">Quiz</option>
              <option value="reading">Reading</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <button
              onClick={() => setFilters({ type: '', difficulty: '', week_id: '', batch_id: '' })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Assignments Grid */}
      {assignments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No assignments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {assignment.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  assignment.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  assignment.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {assignment.difficulty}
                </span>
              </div>

              {/* Type Badge */}
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mb-3">
                {assignment.type.replace('_', ' ').toUpperCase()}
              </span>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {assignment.description}
              </p>

              {/* Meta Info */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {assignment.week && (
                  <div>📅 Week {assignment.week.week_number}: {assignment.week.title}</div>
                )}
                {assignment.due_date && (
                  <div>⏰ Due: {new Date(assignment.due_date).toLocaleDateString()}</div>
                )}
                <div>🎯 Max Score: {assignment.max_score}</div>
              </div>

              {/* Status Badges for Trainee */}
              {isTrainee && (
                <div className="flex gap-2 mb-4">
                  {getStatusBadge(assignment)}
                  {getScoreBadge(assignment)}
                </div>
              )}

              {/* Submission Count for Trainer/Admin */}
              {isTrainerOrAdmin && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  📝 {assignment.submissions?.length || 0} submissions
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/assignments/${assignment.id}`)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  {isTrainee ? (assignment.my_submission ? 'View Submission' : 'Submit') : 'View Details'}
                </button>

                {isTrainerOrAdmin && (
                  <>
                    <button
                      onClick={() => handleTogglePublish(assignment.id, assignment.is_published)}
                      className={`px-4 py-2 rounded-lg transition text-sm ${
                        assignment.is_published
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {assignment.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}