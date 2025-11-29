import axiosInstance from './axios';
import { Assignment, Submission, Rubric, Evaluation } from '@/types';

interface AssignmentFilters {
  week_id?: number;
  day_id?: number;
  batch_id?: number;
  type?: 'mini_task' | 'project' | 'quiz' | 'reading';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'published' | 'draft';
  page?: number;
  per_page?: number;
}

interface SubmissionFilters {
  assignment_id?: number;
  status?: 'pending' | 'submitted' | 'graded' | 'resubmit';
  page?: number;
  per_page?: number;
}

interface GradeData {
  score: number;
  feedback?: string;
  status: 'graded' | 'resubmit';
}

interface EvaluationReview {
  reviewed_feedback?: string;
  adjusted_scores?: Record<string, { score: number; feedback: string }>;
}

class AssignmentService {
  // ==================== ASSIGNMENT CRUD ====================
  
  /**
   * Get all assignments with filters (All roles)
   */
  async getAssignments(filters?: AssignmentFilters) {
    const { data } = await axiosInstance.get('/assignments');
    return data;
  }

  /**
   * Get assignments assigned to the logged-in trainee (Trainee only)
   */
  async getMyAssignments(): Promise<Assignment[]> {
    const { data } = await axiosInstance.get<Assignment[]>('/assignments/my');
    return data;
  }

  /**
   * Get a single assignment by ID (All roles)
   */
  async getAssignment(id: number): Promise<Assignment> {
    const { data } = await axiosInstance.get<Assignment>(`/assignments/${id}`);
    return data;
  }

  /**
   * Create a new assignment (Admin/Trainer only)
   */
  async createAssignment(assignmentData: Partial<Assignment>): Promise<Assignment> {
    const { data } = await axiosInstance.post<{ assignment: Assignment }>(
      '/assignments',
      assignmentData
    );
    return data.assignment;
  }

  /**
   * Update an existing assignment (Admin/Trainer only)
   */
  async updateAssignment(id: number, assignmentData: Partial<Assignment>): Promise<Assignment> {
    const { data } = await axiosInstance.put<{ assignment: Assignment }>(
      `/assignments/${id}`,
      assignmentData
    );
    return data.assignment;
  }

  /**
   * Delete an assignment (Admin/Trainer only)
   */
  async deleteAssignment(id: number): Promise<void> {
    await axiosInstance.delete(`/assignments/${id}`);
  }

  /**
   * Publish/Unpublish an assignment (Admin/Trainer only)
   */
  async togglePublishStatus(id: number, isPublished: boolean): Promise<Assignment> {
    const { data } = await axiosInstance.patch<{ assignment: Assignment }>(
      `/assignments/${id}/publish`,
      { is_published: isPublished }
    );
    return data.assignment;
  }

  // ==================== SUBMISSION MANAGEMENT ====================

  /**
   * Submit an assignment (Trainee only)
   */
  async submitAssignment(assignmentId: number, submissionData: FormData): Promise<Submission> {
    const { data } = await axiosInstance.post<{ submission: Submission }>(
      `/assignments/${assignmentId}/submit`,
      submissionData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.submission;
  }

  /**
   * Get my submission for a specific assignment (Trainee only)
   */
  async getMySubmission(assignmentId: number): Promise<Submission | null> {
    try {
      const { data } = await axiosInstance.get<Submission>(
        `/assignments/${assignmentId}/my-submission`
      );
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get all my submissions (Trainee only)
   */
  async getMySubmissions(filters?: SubmissionFilters) {
    const { data } = await axiosInstance.get('/submissions/my', { params: filters });
    return data;
  }

  /**
   * Get all submissions for a specific assignment (Admin/Trainer only)
   */
  async getAssignmentSubmissions(assignmentId: number, filters?: SubmissionFilters): Promise<{
    data: Submission[];
    meta?: any;
  }> {
    const { data } = await axiosInstance.get(`/assignments/${assignmentId}/submissions`, {
      params: filters,
    });
    return data;
  }

  /**
   * Get a single submission by ID (Admin/Trainer only)
   */
  async getSubmission(submissionId: number): Promise<Submission> {
    const { data } = await axiosInstance.get<Submission>(`/submissions/${submissionId}`);
    return data;
  }

  /**
   * Grade a submission manually (Admin/Trainer only)
   */
  async gradeSubmission(submissionId: number, gradeData: GradeData): Promise<Submission> {
    const { data } = await axiosInstance.post<{ submission: Submission }>(
      `/submissions/${submissionId}/grade`,
      gradeData
    );
    return data.submission;
  }

  /**
   * Delete a submission (Trainee can delete own, Admin/Trainer can delete any)
   */
  async deleteSubmission(submissionId: number): Promise<void> {
    await axiosInstance.delete(`/submissions/${submissionId}`);
  }

  /**
   * Resubmit an assignment after requesting changes (Trainee only)
   */
  async resubmitAssignment(submissionId: number, submissionData: FormData): Promise<Submission> {
    const { data } = await axiosInstance.post<{ submission: Submission }>(
      `/submissions/${submissionId}/resubmit`,
      submissionData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.submission;
  }

  // ==================== RUBRIC MANAGEMENT ====================

  /**
   * Get rubrics for an assignment (All roles)
   */
  async getAssignmentRubrics(assignmentId: number): Promise<Rubric[]> {
    const { data } = await axiosInstance.get<Rubric[]>(`/assignments/${assignmentId}/rubrics`);
    return data;
  }

  /**
   * Create a rubric for an assignment (Admin/Trainer only)
   */
  async createRubric(assignmentId: number, rubricData: Partial<Rubric>): Promise<Rubric> {
    const { data } = await axiosInstance.post<{ rubric: Rubric }>(
      `/assignments/${assignmentId}/rubrics`,
      rubricData
    );
    return data.rubric;
  }

  /**
   * Update a rubric (Admin/Trainer only)
   */
  async updateRubric(rubricId: number, rubricData: Partial<Rubric>): Promise<Rubric> {
    const { data } = await axiosInstance.put<{ rubric: Rubric }>(
      `/rubrics/${rubricId}`,
      rubricData
    );
    return data.rubric;
  }

  /**
   * Delete a rubric (Admin/Trainer only)
   */
  async deleteRubric(rubricId: number): Promise<void> {
    await axiosInstance.delete(`/rubrics/${rubricId}`);
  }

  // ==================== EVALUATION/AI GRADING ====================

  /**
   * Trigger AI evaluation for a submission (Admin/Trainer only)
   */
  async evaluateSubmission(submissionId: number): Promise<Evaluation> {
    const { data } = await axiosInstance.post<{ evaluation: Evaluation }>(
      `/submissions/${submissionId}/evaluate`
    );
    return data.evaluation;
  }

  /**
   * Get evaluation for a submission (All roles)
   */
  async getSubmissionEvaluation(submissionId: number): Promise<Evaluation | null> {
    try {
      const { data } = await axiosInstance.get<Evaluation>(
        `/submissions/${submissionId}/evaluation`
      );
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Review and adjust AI evaluation (Admin/Trainer only)
   */
  async reviewEvaluation(evaluationId: number, reviewData: EvaluationReview): Promise<Evaluation> {
    const { data } = await axiosInstance.post<{ evaluation: Evaluation }>(
      `/evaluations/${evaluationId}/review`,
      reviewData
    );
    return data.evaluation;
  }

  // ==================== STATISTICS & ANALYTICS ====================

  /**
   * Get assignment statistics (Admin/Trainer only)
   */
  async getAssignmentStats(assignmentId: number): Promise<{
    total_submissions: number;
    graded_submissions: number;
    pending_submissions: number;
    average_score: number;
    completion_rate: number;
  }> {
    const { data } = await axiosInstance.get(`/assignments/${assignmentId}/stats`);
    return data;
  }

  /**
   * Get trainee progress on assignments (Trainee only)
   */
  async getMyProgress(): Promise<{
    total_assignments: number;
    completed_assignments: number;
    pending_assignments: number;
    average_score: number;
  }> {
    const { data } = await axiosInstance.get('/assignments/my-progress');
    return data;
  }

  /**
   * Get weekly scores for progress tracking (Trainee only)
   */
  async getWeeklyScores(): Promise<any[]> {
    const { data } = await axiosInstance.get('/progress/weekly-scores');
    return data;
  }

  /**
   * Get category-wise scores (Trainee only)
   */
  async getCategoryScores(): Promise<any> {
    const { data } = await axiosInstance.get('/progress/category-scores');
    return data;
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk delete assignments (Admin/Trainer only)
   */
  async bulkDeleteAssignments(assignmentIds: number[]): Promise<void> {
    await axiosInstance.post('/assignments/bulk-delete', { ids: assignmentIds });
  }

  /**
   * Bulk publish/unpublish assignments (Admin/Trainer only)
   */
  async bulkTogglePublish(assignmentIds: number[], isPublished: boolean): Promise<void> {
    await axiosInstance.post('/assignments/bulk-publish', {
      ids: assignmentIds,
      is_published: isPublished,
    });
  }

  // ==================== FILE DOWNLOADS ====================

  /**
   * Download submission file
   */
  async downloadSubmissionFile(submissionId: number): Promise<Blob> {
    const { data } = await axiosInstance.get(`/submissions/${submissionId}/download`, {
      responseType: 'blob',
    });
    return data;
  }

  /**
   * Export assignment submissions as CSV (Admin/Trainer only)
   */
  async exportSubmissions(assignmentId: number): Promise<Blob> {
    const { data } = await axiosInstance.get(`/assignments/${assignmentId}/export`, {
      responseType: 'blob',
    });
    return data;
  }
}

export default new AssignmentService();