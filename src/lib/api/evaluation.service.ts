import axiosInstance from './axios';
import { Evaluation, Rubric, TraineeProgress } from '@/types';

class EvaluationService {
  async triggerEvaluation(submissionId: number): Promise<Evaluation> {
    const { data } = await axiosInstance.post<{evaluation: Evaluation}>(`/submissions/${submissionId}/evaluate`);
    return data.evaluation;
  }

  async getEvaluation(submissionId: number): Promise<Evaluation | null> {
    try {
      const { data } = await axiosInstance.get<Evaluation>(`/submissions/${submissionId}/evaluation`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async reviewEvaluation(evaluationId: number, overrides: any): Promise<Evaluation> {
    const { data } = await axiosInstance.post<{evaluation: Evaluation}>(
      `/evaluations/${evaluationId}/review`,
      overrides
    );
    return data.evaluation;
  }

  async getMyProgress() {
    const { data } = await axiosInstance.get('/progress/my');
    return data;
  }

  async getWeeklyScores() {
    const { data } = await axiosInstance.get('/progress/weekly-scores');
    return data;
  }

  async getCategoryScores() {
    const { data } = await axiosInstance.get('/progress/category-scores');
    return data;
  }

  // Rubric management
  async getRubrics(assignmentId: number): Promise<Rubric[]> {
    const { data } = await axiosInstance.get<Rubric[]>(`/assignments/${assignmentId}/rubrics`);
    return data;
  }

  async createRubric(assignmentId: number, rubricData: Partial<Rubric>): Promise<Rubric> {
    const { data } = await axiosInstance.post<{rubric: Rubric}>(`/assignments/${assignmentId}/rubrics`, rubricData);
    return data.rubric;
  }

  async updateRubric(rubricId: number, rubricData: Partial<Rubric>): Promise<Rubric> {
    const { data } = await axiosInstance.put<{rubric: Rubric}>(`/rubrics/${rubricId}`, rubricData);
    return data.rubric;
  }

  async deleteRubric(rubricId: number): Promise<void> {
    await axiosInstance.delete(`/rubrics/${rubricId}`);
  }
}

export default new EvaluationService();