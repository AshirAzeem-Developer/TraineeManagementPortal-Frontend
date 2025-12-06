import axiosInstance from './axios';

export interface Batch {
  id: number;
  name: string;
  duration_months: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

class BatchService {
  async getAllBatches(): Promise<Batch[]> {
    const { data } = await axiosInstance.get<Batch[]>('/batches');
    return data;
  }

  async createBatch(batchData: Partial<Batch>): Promise<Batch> {
    const { data } = await axiosInstance.post<Batch>('/batches', batchData);
    return data;
  }

  async updateBatch(id: number, batchData: Partial<Batch>): Promise<Batch> {
    const { data } = await axiosInstance.put<Batch>(`/batches/${id}`, batchData);
    return data;
  }

  async deleteBatch(id: number): Promise<void> {
    await axiosInstance.delete(`/batches/${id}`);
  }
}

export default new BatchService();