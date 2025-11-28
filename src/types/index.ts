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

export interface Week {
  id: number;
  week_number: number;
  title: string;
  description: string | null;
  month: number;
  total_hours: number;
  is_active: boolean;
  days?: Day[];
  assignments?: Assignment[];
  created_at: string;
  updated_at: string;
}

export interface Day {
  id: number;
  week_id: number;
  day_number: number;
  title: string;
  description: string | null;
  hours: number;
  week?: Week;
  topics?: Topic[];
  assignments?: Assignment[];
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: number;
  day_id: number;
  title: string;
  description: string | null;
  learning_objectives: string[] | null;
  resources: string[] | null;
  duration_minutes: number;
  order: number;
  day?: Day;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: number;
  week_id: number | null;
  day_id: number | null;
  batch_id: number | null;
  created_by: number;
  title: string;
  description: string;
  requirements: string[] | null;
  resources: string[] | null;
  type: 'mini_task' | 'project' | 'quiz' | 'reading';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  max_score: number;
  due_date: string | null;
  is_published: boolean;
  week?: Week;
  day?: Day;
  batch?: Batch;
  creator?: User;
  my_submission?: Submission;
  submissions?: Submission[];
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  code_submission: string | null;
  file_path: string | null;
  github_url: string | null;
  live_url: string | null;
  notes: string | null;
  status: 'pending' | 'submitted' | 'graded' | 'resubmit';
  score: number | null;
  feedback: string | null;
  graded_by: number | null;
  graded_at: string | null;
  assignment?: Assignment;
  user?: User;
  grader?: User;
  created_at: string;
  updated_at: string;
}