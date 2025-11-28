import axiosInstance from './axios';
import { Assignment, Submission } from '@/types';

interface AssignmentFilters {
  week_id?: number;
  batch_id?: number;
  type?: string;
  page?: number;
}

class AssignmentService {
  async getAssignments(filters?: AssignmentFilters) {
    const { data } = await axiosInstance.get('/assignments', { params: filters });
    return data;
  }

  async getMyAssignments(): Promise<Assignment[]> {
    const { data } = await axiosInstance.get<Assignment[]>('/assignments/my');
    return data;
  }

  async getAssignment(id: number): Promise<Assignment> {
    const { data } = await axiosInstance.get<Assignment>(`/assignments/${id}`);
    return data;
  }

  async createAssignment(assignmentData: Partial<Assignment>): Promise<Assignment> {
    const { data } = await axiosInstance.post<{assignment: Assignment}>('/assignments', assignmentData);
    return data.assignment;
  }

  async updateAssignment(id: number, assignmentData: Partial<Assignment>): Promise<Assignment> {
    const { data } = await axiosInstance.put<{assignment: Assignment}>(`/assignments/${id}`, assignmentData);
    return data.assignment;
  }

  async deleteAssignment(id: number): Promise<void> {
    await axiosInstance.delete(`/assignments/${id}`);
  }

  async submitAssignment(assignmentId: number, submissionData: FormData): Promise<Submission> {
    const { data } = await axiosInstance.post<{submission: Submission}>(
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

  async getMySubmission(assignmentId: number): Promise<Submission | null> {
    try {
      const { data } = await axiosInstance.get<Submission>(`/assignments/${assignmentId}/my-submission`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getMySubmissions(page = 1) {
    const { data } = await axiosInstance.get('/submissions/my', { params: { page } });
    return data;
  }

  async getAssignmentSubmissions(assignmentId: number): Promise<Submission[]> {
    const { data } = await axiosInstance.get<Submission[]>(`/assignments/${assignmentId}/submissions`);
    return data;
  }

  async gradeSubmission(submissionId: number, gradeData: { score: number; feedback?: string; status: string }): Promise<Submission> {
    const { data } = await axiosInstance.post<{submission: Submission}>(`/submissions/${submissionId}/grade`, gradeData);
    return data.submission;
  }

  async deleteSubmission(submissionId: number): Promise<void> {
    await axiosInstance.delete(`/submissions/${submissionId}`);
  }
}

export default new AssignmentService();