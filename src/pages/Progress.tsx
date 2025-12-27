import { motion } from 'framer-motion';
import { TrendingUp, Flame, Trophy, Target, BookOpen, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { storage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Progress = () => {
  const { user } = useAuth();
  const courses = storage.getCourses();
  const weeklyProgress = storage.getProgress();

  const totalLessonsCompleted = weeklyProgress.reduce((acc, p) => acc + p.lessonsCompleted, 0);
  const totalHoursStudied = weeklyProgress.reduce((acc, p) => acc + p.hoursStudied, 0);
  const maxLessons = Math.max(...weeklyProgress.map(p => p.lessonsCompleted));

  const overallProgress = Math.round(
    courses.reduce((acc, c) => acc + c.progress, 0) / courses.length
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Your Progress</h1>
        <p className="text-muted-foreground mt-1">Track your learning achievements</p>
      </motion.div>

      {/* Streak & Points Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="gradient-accent p-6 text-accent-foreground">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-foreground/20 backdrop-blur-sm">
                  <Flame className="h-8 w-8 animate-streak" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{user?.streak} Day Streak!</p>
                  <p className="text-accent-foreground/80">Keep learning to maintain it</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-full bg-accent-foreground/20 px-5 py-3">
                <Trophy className="h-6 w-6" />
                <span className="text-xl font-bold">{user?.totalPoints?.toLocaleString()} pts</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalLessonsCompleted}</p>
                <p className="text-sm text-muted-foreground">Lessons this week</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="p-6 border border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-backend/10">
                <Clock className="h-6 w-6 text-backend" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalHoursStudied.toFixed(1)}h</p>
                <p className="text-sm text-muted-foreground">Hours studied</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Overall progress</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Weekly Activity</h2>
            </div>
            <span className="text-sm text-muted-foreground">Last 7 days</span>
          </div>

          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyProgress.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-medium text-foreground mb-1">
                    {day.lessonsCompleted}
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all",
                      day.lessonsCompleted === maxLessons 
                        ? "gradient-primary" 
                        : "bg-primary/30"
                    )}
                    style={{ 
                      height: `${(day.lessonsCompleted / maxLessons) * 100}px`,
                      minHeight: day.lessonsCompleted > 0 ? '20px' : '4px'
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Course Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 border border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-6">Course Progress</h2>
          <div className="space-y-5">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{course.title}</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    course.category === 'frontend' && "text-frontend",
                    course.category === 'backend' && "text-backend",
                    course.category === 'design' && "text-design",
                    course.category === 'data' && "text-data",
                  )}>
                    {course.progress}%
                  </span>
                </div>
                <ProgressBar 
                  value={course.progress} 
                  variant={course.category}
                  className="h-2"
                />
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Progress;
