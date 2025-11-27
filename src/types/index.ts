export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'trainee';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TraineeProfile {
  id: number;
  user_id: number;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  date_of_birth: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  avatar: string | null;
  highest_education: string | null;
  institution: string | null;
  field_of_study: string | null;
  graduation_year: number | null;
  work_experience: any[];
  skills: string[];
  bio: string | null;
  batch_id: number | null;
  batch?: Batch;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: number;
  name: string;
  duration_months: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  description: string | null;
}

export interface Attendance {
  id: number;
  user_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  total_hours: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStats {
  total_days: number;
  present_days: number;
  late_days: number;
  half_days: number;
  total_hours: number;
}