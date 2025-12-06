import axiosInstance from './axios';
import { User } from './auth.service';

export interface Trainee extends User {
  trainee_profile?: {
    batch?: {
      id: number;
      name: string;
    };
  };
}

class TraineeService {
  async getAllTrainees(): Promise<Trainee[]> {
    const { data } = await axiosInstance.get<Trainee[]>('/trainees');
    return data;
  }

  async createTrainee(traineeData: Partial<Trainee> & { password?: string; batch_id?: number }): Promise<Trainee> {
    const { data } = await axiosInstance.post<Trainee>('/trainee', traineeData);
    return data;
  }

  async updateTrainee(id: number, traineeData: Partial<Trainee> & { batch_id?: number }): Promise<Trainee> {
    const { data } = await axiosInstance.put<Trainee>(`/trainee/${id}`, traineeData);
    return data;
  }

  async deleteTrainee(id: number): Promise<void> {
    await axiosInstance.delete(`/trainee/${id}`);
  }
}

export default new TraineeService();
