import { User, UserRole, Announcement, ClassSchedule, StudentGrade } from './types';

export const MOCK_USERS: User[] = []; // Empty array, data is now strictly fetched from Spreadsheet

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'End of Semester Exam Schedule',
    content: 'The final exams will begin on December 15th. Please check your individual schedules.',
    date: '2023-11-20',
    author: 'Dr. Sarah Principal',
    type: 'urgent'
  },
  {
    id: '2',
    title: 'Science Fair Registration',
    content: 'Registration for the annual Science Fair is now open via the Vice Principal office.',
    date: '2023-11-18',
    author: 'Mr. James Vice',
    type: 'event'
  }
];

export const STUDENT_GRADES: StudentGrade[] = [
  { subject: 'Mathematics', score: 88, teacher: 'Mr. Smith' },
  { subject: 'Physics', score: 76, teacher: 'Mrs. Emily Teacher' },
  { subject: 'History', score: 92, teacher: 'Mr. Doe' },
  { subject: 'Literature', score: 85, teacher: 'Ms. Johnson' },
  { subject: 'Computer Science', score: 95, teacher: 'Mr. Tech' },
];

export const SCHEDULE: ClassSchedule[] = [
  { time: '08:00 - 09:30', subject: 'Mathematics', room: '101', teacher: 'Mr. Smith' },
  { time: '09:45 - 11:15', subject: 'Physics', room: 'Lab 3', teacher: 'Mrs. Emily Teacher' },
  { time: '12:00 - 13:30', subject: 'History', room: '204', teacher: 'Mr. Doe' },
];