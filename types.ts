export enum UserRole {
  ADMIN = 'ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  VICE_PRINCIPAL = 'VICE_PRINCIPAL',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  username: string;
  password?: string; // Optional for display/handling, required for auth
  subject?: string; // Mata Pelajaran (Column F)
  grade?: string;   // Kelas / Grade (Column G)
}

export interface StudentGrade {
  subject: string;
  score: number;
  teacher: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: 'general' | 'urgent' | 'event';
}

export interface ClassSchedule {
  time: string;
  subject: string;
  room: string;
  teacher: string;
}