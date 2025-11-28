import axiosInstance from './axios';
import { Week, Day, Topic } from '@/types';

class CurriculumService {
  async getWeeks(): Promise<Week[]> {
    const { data } = await axiosInstance.get<Week[]>('/curriculum/weeks');
    return data;
  }

  async getWeek(weekId: number): Promise<Week> {
    const { data } = await axiosInstance.get<Week>(`/curriculum/weeks/${weekId}`);
    return data;
  }

  async getDays(weekId: number): Promise<Day[]> {
    const { data } = await axiosInstance.get<Day[]>(`/curriculum/weeks/${weekId}/days`);
    return data;
  }

  async getDay(dayId: number): Promise<Day> {
    const { data } = await axiosInstance.get<Day>(`/curriculum/days/${dayId}`);
    return data;
  }

  async getTopics(dayId: number): Promise<Topic[]> {
    const { data } = await axiosInstance.get<Topic[]>(`/curriculum/days/${dayId}/topics`);
    return data;
  }
}

export default new CurriculumService();