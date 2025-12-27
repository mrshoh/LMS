import { User, Course, Lesson, Assignment, MentorMessage, WeeklyProgress } from '@/types/lms';

const STORAGE_KEYS = {
  user: 'najot_lms_user',
  courses: 'najot_lms_courses',
  lessons: 'najot_lms_lessons',
  assignments: 'najot_lms_assignments',
  messages: 'najot_lms_messages',
  progress: 'najot_lms_progress',
  isLoggedIn: 'najot_lms_logged_in',
};

// Default data
const defaultUser: User = {
  id: '1',
  name: 'Sardor Raximov',
  email: 'sardor@example.com',
  streak: 7,
  totalPoints: 2450,
};

const defaultCourses: Course[] = [
  {
    id: '1',
    title: 'Frontend Development',
    description: 'Master modern frontend technologies including React, TypeScript, and CSS',
    category: 'frontend',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    instructor: 'Anvar Yusupov',
  },
  {
    id: '2',
    title: 'Backend Development',
    description: 'Build scalable APIs with Node.js, Python, and databases',
    category: 'backend',
    progress: 40,
    totalLessons: 20,
    completedLessons: 8,
    instructor: 'Bobur Karimov',
  },
  {
    id: '3',
    title: 'UI/UX Design',
    description: 'Create beautiful and user-friendly interfaces with Figma',
    category: 'design',
    progress: 85,
    totalLessons: 18,
    completedLessons: 15,
    instructor: 'Malika Azimova',
  },
  {
    id: '4',
    title: 'Data Analytics',
    description: 'Analyze data and create insights with Python and SQL',
    category: 'data',
    progress: 20,
    totalLessons: 22,
    completedLessons: 4,
    instructor: 'Jasur Tursunov',
  },
];

const defaultLessons: Lesson[] = [
  {
    id: '1',
    courseId: '1',
    title: 'React Hooks Deep Dive',
    description: 'Learn advanced React hooks patterns including useState, useEffect, useContext, and custom hooks. We will build practical examples and understand when to use each hook.',
    duration: '45 min',
    order: 17,
    completed: false,
    tasks: [
      { id: 't1', lessonId: '1', title: 'Complete the useState exercise', description: 'Create a counter with increment/decrement', completed: true },
      { id: 't2', lessonId: '1', title: 'Build a custom hook', description: 'Create useLocalStorage hook', completed: false },
      { id: 't3', lessonId: '1', title: 'Watch the video', description: 'Complete the lesson video', completed: true },
    ],
  },
  {
    id: '2',
    courseId: '1',
    title: 'State Management with Context',
    description: 'Master React Context API for global state management',
    duration: '35 min',
    order: 18,
    completed: false,
    tasks: [
      { id: 't4', lessonId: '2', title: 'Create a theme context', description: 'Build dark/light mode toggle', completed: false },
    ],
  },
];

const defaultAssignments: Assignment[] = [
  {
    id: '1',
    lessonId: '1',
    courseId: '1',
    title: 'Build a Todo App with Hooks',
    description: 'Create a fully functional todo application using React hooks. Include add, delete, and toggle completion features.',
    dueDate: '2024-12-30',
    status: 'pending',
  },
  {
    id: '2',
    lessonId: '1',
    courseId: '1',
    title: 'Custom Hook Library',
    description: 'Build 3 custom hooks: useDebounce, useLocalStorage, and useFetch',
    dueDate: '2024-12-28',
    status: 'submitted',
    submission: 'https://github.com/sardor/custom-hooks',
  },
  {
    id: '3',
    lessonId: '2',
    courseId: '1',
    title: 'E-commerce Cart Context',
    description: 'Implement a shopping cart using Context API',
    dueDate: '2024-12-25',
    status: 'approved',
    submission: 'https://github.com/sardor/cart-context',
    feedback: 'Excellent work! Clean code and great understanding of Context patterns.',
    grade: 95,
  },
];

const defaultMessages: MentorMessage[] = [
  {
    id: '1',
    mentorName: 'Anvar Yusupov',
    message: 'Great progress on React hooks! Your custom hook implementation shows real understanding. Keep up the excellent work! 🎉',
    date: '2024-12-27',
    read: false,
  },
  {
    id: '2',
    mentorName: 'Anvar Yusupov',
    message: "Don't forget to submit your Todo App assignment by December 30th. Let me know if you need any help!",
    date: '2024-12-26',
    read: true,
  },
];

const defaultProgress: WeeklyProgress[] = [
  { day: 'Mon', lessonsCompleted: 2, hoursStudied: 3 },
  { day: 'Tue', lessonsCompleted: 1, hoursStudied: 2 },
  { day: 'Wed', lessonsCompleted: 3, hoursStudied: 4 },
  { day: 'Thu', lessonsCompleted: 2, hoursStudied: 2.5 },
  { day: 'Fri', lessonsCompleted: 1, hoursStudied: 1.5 },
  { day: 'Sat', lessonsCompleted: 2, hoursStudied: 3 },
  { day: 'Sun', lessonsCompleted: 1, hoursStudied: 2 },
];

// Storage functions
export const storage = {
  getUser: (): User => {
    const data = localStorage.getItem(STORAGE_KEYS.user);
    return data ? JSON.parse(data) : defaultUser;
  },
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },

  getCourses: (): Course[] => {
    const data = localStorage.getItem(STORAGE_KEYS.courses);
    return data ? JSON.parse(data) : defaultCourses;
  },
  setCourses: (courses: Course[]) => {
    localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));
  },

  getLessons: (): Lesson[] => {
    const data = localStorage.getItem(STORAGE_KEYS.lessons);
    return data ? JSON.parse(data) : defaultLessons;
  },
  setLessons: (lessons: Lesson[]) => {
    localStorage.setItem(STORAGE_KEYS.lessons, JSON.stringify(lessons));
  },

  getAssignments: (): Assignment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.assignments);
    return data ? JSON.parse(data) : defaultAssignments;
  },
  setAssignments: (assignments: Assignment[]) => {
    localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(assignments));
  },

  getMessages: (): MentorMessage[] => {
    const data = localStorage.getItem(STORAGE_KEYS.messages);
    return data ? JSON.parse(data) : defaultMessages;
  },
  setMessages: (messages: MentorMessage[]) => {
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  },

  getProgress: (): WeeklyProgress[] => {
    const data = localStorage.getItem(STORAGE_KEYS.progress);
    return data ? JSON.parse(data) : defaultProgress;
  },
  setProgress: (progress: WeeklyProgress[]) => {
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.isLoggedIn) === 'true';
  },
  setLoggedIn: (value: boolean) => {
    localStorage.setItem(STORAGE_KEYS.isLoggedIn, value.toString());
  },

  initializeData: () => {
    if (!localStorage.getItem(STORAGE_KEYS.courses)) {
      storage.setCourses(defaultCourses);
    }
    if (!localStorage.getItem(STORAGE_KEYS.lessons)) {
      storage.setLessons(defaultLessons);
    }
    if (!localStorage.getItem(STORAGE_KEYS.assignments)) {
      storage.setAssignments(defaultAssignments);
    }
    if (!localStorage.getItem(STORAGE_KEYS.messages)) {
      storage.setMessages(defaultMessages);
    }
    if (!localStorage.getItem(STORAGE_KEYS.progress)) {
      storage.setProgress(defaultProgress);
    }
    if (!localStorage.getItem(STORAGE_KEYS.user)) {
      storage.setUser(defaultUser);
    }
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};
