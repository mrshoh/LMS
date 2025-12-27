import { motion } from 'framer-motion';
import { BookCheck, Clock, Trophy, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export const QuickStats = () => {
  const { user } = useAuth();
  const courses = useLiveQuery(() => db.courses.toArray());
  const progress = useLiveQuery(() => db.weeklyProgress.toArray());

  if (!courses || !progress) return null;

  const totalLessons = courses.reduce((acc, c) => acc + c.completedLessons, 0);
  const totalHours = progress.reduce((acc, p) => acc + p.hoursStudied, 0);
  const activeCourses = courses.filter(c => c.progress > 0 && c.progress < 100).length;

  const stats = [
    {
      icon: BookCheck,
      label: 'Lessons Done',
      value: totalLessons,
      color: 'text-frontend',
      bg: 'bg-frontend/10',
    },
    {
      icon: Clock,
      label: 'Hours Studied',
      value: totalHours.toFixed(1),
      color: 'text-backend',
      bg: 'bg-backend/10',
    },
    {
      icon: Target,
      label: 'Active Courses',
      value: activeCourses,
      color: 'text-design',
      bg: 'bg-design/10',
    },
    {
      icon: Trophy,
      label: 'Total Points',
      value: user?.totalPoints?.toLocaleString() || '0',
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-4 border border-border/50 hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`${stat.bg} p-2.5 rounded-xl`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
