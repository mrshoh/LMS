import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Course } from '@/types/lms';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  index: number;
}

const categoryIcons: Record<string, string> = {
  frontend: '🎨',
  backend: '⚙️',
  design: '✨',
  data: '📊',
};

export const CourseCard = ({ course, index }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card 
        className="group relative overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/courses/${course.id}`)}
      >
        {/* Category color bar */}
        <div className={cn(
          "absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-1.5",
          course.category === 'frontend' && "bg-frontend",
          course.category === 'backend' && "bg-backend",
          course.category === 'design' && "bg-design",
          course.category === 'data' && "bg-data",
        )} />

        <div className="p-5 pl-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{categoryIcons[course.category]}</span>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground">{course.instructor}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {course.completedLessons}/{course.totalLessons} lessons
              </span>
              <span className={cn(
                "font-semibold",
                course.category === 'frontend' && "text-frontend",
                course.category === 'backend' && "text-backend",
                course.category === 'design' && "text-design",
                course.category === 'data' && "text-data",
              )}>
                {course.progress}%
              </span>
            </div>
            <Progress 
              value={course.progress} 
              variant={course.category}
              className="h-2"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
