import { motion } from 'framer-motion';
import { Clock, BookOpen, MessageCircle, ChevronRight, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

export const DailyFocus = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const lessons = storage.getLessons();
  const assignments = storage.getAssignments();
  const messages = storage.getMessages();

  const todayLesson = lessons.find(l => !l.completed);
  const pendingAssignment = assignments.find(a => a.status === 'pending');
  const unreadMessage = messages.find(m => !m.read);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* Header with gradient */}
        <div className="gradient-primary p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Welcome back</p>
              <h2 className="text-2xl font-bold">{user?.name?.split(' ')[0]} 👋</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-2">
              <Flame className="h-5 w-5 animate-streak" />
              <span className="font-bold">{user?.streak} days</span>
            </div>
          </div>
          <p className="mt-2 text-primary-foreground/80">Here's your focus for today</p>
        </div>

        {/* Focus Items */}
        <div className="divide-y divide-border">
          {/* Today's Lesson */}
          {todayLesson && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/lesson/${todayLesson.id}`)}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-frontend/10">
                <BookOpen className="h-6 w-6 text-frontend" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today's Lesson</p>
                <p className="font-semibold text-foreground truncate">{todayLesson.title}</p>
                <p className="text-sm text-muted-foreground">{todayLesson.duration}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          )}

          {/* Pending Assignment */}
          {pendingAssignment && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => navigate('/assignments')}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Due Soon</p>
                <p className="font-semibold text-foreground truncate">{pendingAssignment.title}</p>
                <p className="text-sm text-accent">Due: {new Date(pendingAssignment.dueDate).toLocaleDateString()}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          )}

          {/* Mentor Message */}
          {unreadMessage && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => navigate('/feedback')}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <MessageCircle className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Mentor Message</p>
                <p className="font-semibold text-foreground truncate">{unreadMessage.mentorName}</p>
                <p className="text-sm text-muted-foreground truncate">{unreadMessage.message}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <div className="p-4 bg-secondary/30">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => todayLesson && navigate(`/lesson/${todayLesson.id}`)}
          >
            Continue Learning
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
