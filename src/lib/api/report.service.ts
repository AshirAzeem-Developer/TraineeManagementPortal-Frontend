import api from './axios';

export interface WeeklyReportData {
  trainee: any;
  week: any;
  generated_at: string;
  attendance: any;
  assignments: any;
  overall_score: number;
  ai_insights: any;
}

export interface MonthlyReportData {
  trainee: any;
  month: string;
  generated_at: string;
  attendance: any;
  assignments: any;
  overall_score: number;
  ai_insights: any;
}

export const reportService = {
  getWeeklyReport: async (userId: number, weekId: number) => {
    const response = await api.get<WeeklyReportData>(`/reports/weekly/${userId}/${weekId}`);
    return response.data;
  },

  downloadWeeklyPdf: async (userId: number, weekId: number) => {
    const response = await api.get(`/reports/weekly/${userId}/${weekId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getMonthlyReport: async (userId: number, monthId: number, year?: number) => {
    const response = await api.get<MonthlyReportData>(`/reports/monthly/${userId}/${monthId}`, {
      params: { year },
    });
    return response.data;
  },

  downloadMonthlyPdf: async (userId: number, monthId: number, year?: number) => {
    const response = await api.get(`/reports/monthly/${userId}/${monthId}/pdf`, {
      params: { year },
      responseType: 'blob',
    });
    return response.data;
  },
};
