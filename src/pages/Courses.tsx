import { motion } from 'framer-motion';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { storage } from '@/lib/storage';

const Courses = () => {
  const courses = storage.getCourses();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground mt-1">Continue where you left off</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={course.id} course={course} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
