import axiosInstance from './axios';
import { TraineeProfile } from '@/types';

interface ProfileResponse {
  user: any;
  profile: TraineeProfile;
  completeness: number;
}

class ProfileService {
  async getMyProfile(): Promise<ProfileResponse> {
    const { data } = await axiosInstance.get<ProfileResponse>('/profile/me');
    return data;
  }

  async getProfile(userId: number): Promise<ProfileResponse> {
    const { data } = await axiosInstance.get<ProfileResponse>(`/trainee/${userId}/profile`);
    return data;
  }

  async updateProfile(userId: number, profileData: Partial<TraineeProfile>): Promise<ProfileResponse> {
    const { data } = await axiosInstance.put<ProfileResponse>(`/trainee/${userId}/profile`, profileData);
    return data;
  }

  async uploadAvatar(userId: number, file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await axiosInstance.post(`/trainee/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  }
}

export default new ProfileService();