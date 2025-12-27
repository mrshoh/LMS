import { User, Course, Lesson, Assignment, MentorMessage, WeeklyProgress } from '@/types/lms';
import { db } from './db';

const STORAGE_KEYS = {
  isLoggedIn: 'najot_lms_logged_in',
};

// Storage functions
export const storage = {
  getUser: async (): Promise<User> => {
    const user = await db.users.get('1');
    return user!;
  },
  setUser: async (user: User) => {
    await db.users.put(user);
  },

  getCourses: async (): Promise<Course[]> => {
    return await db.courses.toArray();
  },
  setCourses: async (courses: Course[]) => {
    await db.courses.bulkPut(courses);
  },

  getLessons: async (): Promise<Lesson[]> => {
    return await db.lessons.orderBy('order').toArray();
  },
  setLessons: async (lessons: Lesson[]) => {
    await db.lessons.bulkPut(lessons);
  },

  getAssignments: async (): Promise<Assignment[]> => {
    return await db.assignments.toArray();
  },
  setAssignments: async (assignments: Assignment[]) => {
    await db.assignments.bulkPut(assignments);
  },

  getMessages: async (): Promise<MentorMessage[]> => {
    return await db.messages.orderBy('date').reverse().toArray();
  },
  setMessages: async (messages: MentorMessage[]) => {
    await db.messages.bulkPut(messages);
  },

  getProgress: async (): Promise<WeeklyProgress[]> => {
    return await db.weeklyProgress.toArray();
  },
  setProgress: async (progress: WeeklyProgress[]) => {
    await db.weeklyProgress.bulkPut(progress);
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.isLoggedIn) === 'true';
  },
  setLoggedIn: (value: boolean) => {
    localStorage.setItem(STORAGE_KEYS.isLoggedIn, value.toString());
  },

  // Helper for single updates
  updateLesson: async (lesson: Lesson) => {
    await db.lessons.put(lesson);
  },

  updateAssignment: async (assignment: Assignment) => {
    await db.assignments.put(assignment);
  },

  clearAll: async () => {
    await db.users.clear();
    await db.courses.clear();
    await db.lessons.clear();
    await db.assignments.clear();
    await db.messages.clear();
    await db.weeklyProgress.clear();
    localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
  },
};
