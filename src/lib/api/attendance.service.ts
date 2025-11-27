import axiosInstance from './axios';
import { Attendance, AttendanceStats } from '@/types';

interface AttendanceResponse {
  attendance: Attendance;
  message?: string;
}

interface MyAttendanceResponse {
  attendances: {
    data: Attendance[];
    total: number;
    current_page: number;
    last_page: number;
  };
  stats: AttendanceStats;
  today: Attendance | null;
}

interface TodayStatusResponse {
  attendance: Attendance | null;
  can_check_in: boolean;
  can_check_out: boolean;
}

class AttendanceService {
  async checkIn(): Promise<AttendanceResponse> {
    const { data } = await axiosInstance.post<AttendanceResponse>('/attendance/checkin');
    return data;
  }

  async checkOut(): Promise<AttendanceResponse> {
    const { data } = await axiosInstance.post<AttendanceResponse>('/attendance/checkout');
    return data;
  }

  async getTodayStatus(): Promise<TodayStatusResponse> {
    const { data } = await axiosInstance.get<TodayStatusResponse>('/attendance/today');
    return data;
  }

  async getMyAttendance(page = 1, filters?: { month?: number; year?: number }): Promise<MyAttendanceResponse> {
    const { data } = await axiosInstance.get<MyAttendanceResponse>('/attendance/my', {
      params: { page, ...filters },
    });
    return data;
  }

  async getAllAttendances(page = 1, filters?: { date?: string; user_id?: number }) {
    const { data } = await axiosInstance.get('/attendance', {
      params: { page, ...filters },
    });
    return data;
  }
}

export default new AttendanceService();