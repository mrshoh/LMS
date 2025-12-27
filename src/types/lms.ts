export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  streak: number;
  totalPoints: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'frontend' | 'backend' | 'design' | 'data';
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail?: string;
  instructor: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: string;
  order: number;
  completed: boolean;
  tasks: Task[];
}

export interface Task {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Assignment {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  submission?: string;
  feedback?: string;
  grade?: number;
}

export interface MentorMessage {
  id: string;
  mentorName: string;
  mentorAvatar?: string;
  message: string;
  date: string;
  read: boolean;
}

export interface WeeklyProgress {
  day: string;
  lessonsCompleted: number;
  hoursStudied: number;
}
