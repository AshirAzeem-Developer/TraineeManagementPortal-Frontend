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
}

export default new TraineeService();
