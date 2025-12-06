import api from './axios';

export interface DashboardStats {
  total_batches: number;
  active_trainees: number;
  weeks_completed: number;
  projects_submitted: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};
