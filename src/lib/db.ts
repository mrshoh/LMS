import Dexie, { type Table } from 'dexie';
import { User, Course, Lesson, Assignment, MentorMessage, WeeklyProgress } from '@/types/lms';

export interface LessonNote {
    lessonId: string;
    content: string;
    lastUpdated: string;
}

export class LMSDatabase extends Dexie {
    users!: Table<User>;
    courses!: Table<Course>;
    lessons!: Table<Lesson>;
    assignments!: Table<Assignment>;
    messages!: Table<MentorMessage>;
    weeklyProgress!: Table<WeeklyProgress>;
    notes!: Table<LessonNote>;

    constructor() {
        super('LMSDatabase');
        this.version(2).stores({
            users: 'id',
            courses: 'id, category',
            lessons: 'id, courseId, order',
            assignments: 'id, status',
            messages: 'id, date, read',
            weeklyProgress: 'id, day',
            notes: 'lessonId'
        });
    }
}

export const db = new LMSDatabase();

// Default Data
export const defaultUser: User = {
    id: '1',
    name: 'Sardor Raximov',
    email: 'sardor@example.com',
    streak: 7,
    totalPoints: 2450,
};

export const defaultCourses: Course[] = [
    {
        id: '1',
        title: 'Frontend Development',
        description: 'Master modern frontend technologies including React, TypeScript, and CSS',
        category: 'frontend',
        progress: 65,
        totalLessons: 3,
        completedLessons: 2,
        instructor: 'Anvar Yusupov',
    },
    {
        id: '2',
        title: 'Backend Development',
        description: 'Build scalable APIs with Node.js, Python, and databases',
        category: 'backend',
        progress: 0,
        totalLessons: 2,
        completedLessons: 0,
        instructor: 'Bobur Karimov',
    },
    {
        id: '3',
        title: 'UI/UX Design',
        description: 'Create beautiful and user-friendly interfaces with Figma',
        category: 'design',
        progress: 0,
        totalLessons: 2,
        completedLessons: 0,
        instructor: 'Malika Azimova',
    },
    {
        id: '4',
        title: 'Data Analytics',
        description: 'Analyze data and create insights with Python and SQL',
        category: 'data',
        progress: 0,
        totalLessons: 2,
        completedLessons: 0,
        instructor: 'Jasur Tursunov',
    },
    {
        id: '5',
        title: 'Mobile App Development',
        description: 'Build cross-platform mobile apps with React Native',
        category: 'mobile',
        progress: 0,
        totalLessons: 2,
        completedLessons: 0,
        instructor: 'Dilshod Normatov',
    },
];

export const defaultLessons: Lesson[] = [
    // Frontend
    {
        id: '1',
        courseId: '1',
        title: 'React Hooks Deep Dive',
        description: 'Learn advanced React hooks patterns including useState, useEffect, useContext, and custom hooks.',
        videoUrl: 'https://www.youtube.com/embed/LlvBzyy-558',
        duration: '45 min',
        order: 1,
        completed: true,
        tasks: [
            { id: 't1', lessonId: '1', title: 'Complete the useState exercise', description: 'Create a counter', completed: true },
            { id: 't2', lessonId: '1', title: 'Watch the video', description: 'Complete the lesson video', completed: true },
        ],
    },
    {
        id: '2',
        courseId: '1',
        title: 'State Management with Context',
        description: 'Master React Context API for global state management',
        videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc',
        duration: '35 min',
        order: 2,
        completed: true,
        tasks: [
            { id: 't3', lessonId: '2', title: 'Create a theme context', description: 'Build dark/light mode toggle', completed: true },
        ],
    },
    {
        id: '3',
        courseId: '1',
        title: 'Advanced Custom Hooks',
        description: 'Building reusable logic with custom hooks',
        videoUrl: 'https://www.youtube.com/embed/J-g9ZJha8FE',
        duration: '40 min',
        order: 3,
        completed: false,
        tasks: [
            { id: 't4', lessonId: '3', title: 'Build useFetch hook', description: 'Create a data fetching hook', completed: false },
        ],
    },
    // Backend
    {
        id: '4',
        courseId: '2',
        title: 'Node.js Architecture',
        description: 'Introduction to Event Loop and Node.js internals',
        videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
        duration: '50 min',
        order: 1,
        completed: false,
        tasks: [
            { id: 't5', lessonId: '4', title: 'Set up a basic server', description: 'Use HTTP module', completed: false },
        ],
    },
    // UI/UX
    {
        id: '5',
        courseId: '3',
        title: 'Introduction to Figma',
        description: 'Master the basics of Figma workspace and tools',
        videoUrl: 'https://www.youtube.com/embed/Gu1so3qzASo',
        duration: '60 min',
        order: 1,
        completed: false,
        tasks: [
            { id: 't6', lessonId: '5', title: 'Design a simple card', description: 'Practice using shapes and text', completed: false },
        ],
    },
    {
        id: '6',
        courseId: '3',
        title: 'Auto Layout Masterclass',
        description: 'Creating responsive designs with Figma Auto Layout',
        videoUrl: 'https://www.youtube.com/embed/Nr8N_0-t2Lw',
        duration: '45 min',
        order: 2,
        completed: false,
        tasks: [
            { id: 't7', lessonId: '6', title: 'Build a responsive navbar', description: 'Use nested auto layout', completed: false },
        ],
    },
    // Data Analytics
    {
        id: '7',
        courseId: '4',
        title: 'SQL for Data Science',
        description: 'Introduction to relational databases and basic queries',
        videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
        duration: '55 min',
        order: 1,
        completed: false,
        tasks: [
            { id: 't8', lessonId: '7', title: 'Write a JOIN query', description: 'Connect two tables', completed: false },
        ],
    },
    // Mobile
    {
        id: '8',
        courseId: '5',
        title: 'React Native Basics',
        description: 'Set up your environment and build your first mobile app',
        videoUrl: 'https://www.youtube.com/embed/Hf4MJH0jGVw',
        duration: '70 min',
        order: 1,
        completed: false,
        tasks: [
            { id: 't9', lessonId: '8', title: 'Build a Hello World app', description: 'Use React Native CLI or Expo', completed: false },
        ],
    },
];

export const defaultAssignments: Assignment[] = [
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

export const defaultMessages: MentorMessage[] = [
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

export const defaultProgress: WeeklyProgress[] = [
    { day: 'Mon', lessonsCompleted: 2, hoursStudied: 3 },
    { day: 'Tue', lessonsCompleted: 1, hoursStudied: 2 },
    { day: 'Wed', lessonsCompleted: 3, hoursStudied: 4 },
    { day: 'Thu', lessonsCompleted: 2, hoursStudied: 2.5 },
    { day: 'Fri', lessonsCompleted: 1, hoursStudied: 1.5 },
    { day: 'Sat', lessonsCompleted: 2, hoursStudied: 3 },
    { day: 'Sun', lessonsCompleted: 1, hoursStudied: 2 },
];

export async function initializeDatabase() {
    const isSeeded = localStorage.getItem('lms_data_seeded_v3');
    if (!isSeeded) {
        await db.users.clear();
        await db.courses.clear();
        await db.lessons.clear();
        await db.assignments.clear();
        await db.messages.clear();
        await db.weeklyProgress.clear();
        await db.notes.clear();

        await db.users.add(defaultUser);
        await db.courses.bulkAdd(defaultCourses);
        await db.lessons.bulkAdd(defaultLessons);
        await db.assignments.bulkAdd(defaultAssignments);
        await db.messages.bulkAdd(defaultMessages);
        await db.weeklyProgress.bulkAdd(defaultProgress);

        localStorage.setItem('lms_data_seeded_v3', 'true');
        console.log('Database initialized and seeded with version 3 data');
    }
}
