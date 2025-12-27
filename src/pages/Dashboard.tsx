import { motion } from 'framer-motion';
import { DailyFocus } from '@/components/dashboard/DailyFocus';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { storage } from '@/lib/storage';

const Dashboard = () => {
  const courses = storage.getCourses();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your learning journey</p>
      </motion.div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Focus - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <DailyFocus />
        </div>

        {/* Courses Grid - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Courses</h2>
            <span className="text-sm text-muted-foreground">{courses.length} enrolled</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
