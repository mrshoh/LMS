import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Share2,
  Download,
  MessageSquare,
  Sparkles,
  Volume2,
  Maximize2,
  SkipBack,
  SkipForward,
  List,
  StickyNote,
  FolderOpen,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { storage } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const lessons = useLiveQuery(() => db.lessons.toArray()) || [];
  const courses = useLiveQuery(() => db.courses.toArray()) || [];
  const lesson = useLiveQuery(() => db.lessons.get(id || '')) || null;
  const savedNote = useLiveQuery(() => db.notes.get(id || ''));

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [notes, setNotes] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    if (savedNote) {
      setNotes(savedNote.content);
    }
  }, [savedNote]);

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && videoProgress < 100) {
      interval = setInterval(() => {
        setVideoProgress(prev => Math.min(prev + 0.5, 100));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoProgress]);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-xl font-semibold text-foreground">Lesson not found</p>
        <p className="text-muted-foreground mt-2">This lesson might have been moved or deleted</p>
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-6">
          Go back to dashboard
        </Button>
      </div>
    );
  }

  const course = courses.find(c => c.id === lesson.courseId);
  const completedTasks = lesson.tasks.filter(t => t.completed).length;
  const progressPercent = (completedTasks / lesson.tasks.length) * 100;

  const courseLessons = lessons.filter(l => l.courseId === lesson.courseId).sort((a, b) => a.order - b.order);
  const currentIndex = courseLessons.findIndex(l => l.id === id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  const toggleTask = async (taskId: string) => {
    if (!lesson) return;

    const updatedTasks = lesson.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    await db.lessons.update(lesson.id, { tasks: updatedTasks });

    // Update overall course progress
    const courseLessons = lessons.filter(l => l.courseId === lesson.courseId);
    const totalTasks = courseLessons.reduce((acc, l) => acc + l.tasks.length, 0);
    const completedTasksAcrossCourse = courseLessons.reduce((acc, l) =>
      acc + (l.id === lesson.id ? updatedTasks : l.tasks).filter(t => t.completed).length, 0
    );

    const newProgress = Math.round((completedTasksAcrossCourse / totalTasks) * 100);
    await db.courses.update(lesson.courseId, { progress: newProgress });

    toast.success('Task updated!');
  };

  const resources = [
    { icon: FileText, name: 'Lesson Slides.pdf', size: '2.4 MB' },
    { icon: FolderOpen, name: 'Starter Code.zip', size: '1.2 MB' },
    { icon: FileText, name: 'Cheat Sheet.pdf', size: '890 KB' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumb Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-1 px-2">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{course?.title}</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">Lesson {lesson.order}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              toast.success(isBookmarked ? 'Bookmark removed' : 'Lesson bookmarked!');
            }}
            className={cn(isBookmarked && "text-warning")}
          >
            {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video & Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              {/* Video Area */}
              <div className="relative aspect-video bg-gradient-to-br from-foreground/5 via-primary/10 to-backend/10 overflow-hidden group">
                {lesson?.videoUrl ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.15),transparent_50%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.15),transparent_50%)]" />
                      <motion.div
                        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZ24+PC9zdmc+')]"
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all",
                          isPlaying
                            ? "bg-foreground/90 text-background"
                            : "gradient-primary text-primary-foreground shadow-glow"
                        )}
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        <AnimatePresence mode="wait">
                          {isPlaying ? (
                            <motion.div
                              key="pause"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Pause className="h-10 w-10" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="play"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Play className="h-10 w-10 ml-1" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>

                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="h-1 bg-primary-foreground/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full gradient-primary"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-primary-foreground">
                        <div className="flex items-center gap-3">
                          <button className="hover:text-primary transition-colors">
                            <SkipBack className="h-5 w-5" />
                          </button>
                          <button
                            className="hover:text-primary transition-colors"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </button>
                          <button className="hover:text-primary transition-colors">
                            <SkipForward className="h-5 w-5" />
                          </button>
                          <span className="text-sm ml-2">
                            {Math.floor(videoProgress * 0.45)}:{String(Math.floor((videoProgress * 0.45 % 1) * 60)).padStart(2, '0')} / {lesson.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="hover:text-primary transition-colors">
                            <Volume2 className="h-5 w-5" />
                          </button>
                          <button className="hover:text-primary transition-colors">
                            <Maximize2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* Playing indicator */}
                {isPlaying && (
                  <motion.div
                    className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                    <span className="text-xs font-medium text-primary-foreground">PLAYING</span>
                  </motion.div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="text-primary font-medium">{lesson.duration}</span>
                  </div>
                  <span>•</span>
                  <span>Lesson {lesson.order} of {lessons.length}</span>
                  {videoProgress > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-success font-medium">{Math.round(videoProgress)}% watched</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{lesson.title}</h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">{lesson.description}</p>

                {/* XP Badge */}
                <motion.div
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-warning/10 px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="h-4 w-4 text-warning" />
                  <span className="text-sm font-semibold text-warning">+50 XP on completion</span>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Lesson Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <Button
              variant="outline"
              className="flex-1 h-auto py-4 justify-start"
              disabled={!prevLesson}
              onClick={() => prevLesson && navigate(`/lesson/${prevLesson.id}`)}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Previous</p>
                <p className="font-medium truncate">{prevLesson?.title || 'No previous lesson'}</p>
              </div>
            </Button>
            <Button
              variant="default"
              className="flex-1 h-auto py-4 justify-end"
              disabled={!nextLesson}
              onClick={() => nextLesson && navigate(`/lesson/${nextLesson.id}`)}
            >
              <div className="text-right">
                <p className="text-xs text-primary-foreground/80">Next</p>
                <p className="font-medium truncate">{nextLesson?.title || 'Course complete!'}</p>
              </div>
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Tabs for Tasks/Notes/Resources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border border-border/50 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 p-1 bg-secondary/50">
                  <TabsTrigger value="tasks" className="gap-1.5">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">Tasks</span>
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="gap-1.5">
                    <StickyNote className="h-4 w-4" />
                    <span className="hidden sm:inline">Notes</span>
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="gap-1.5">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Files</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tasks Tab */}
                <TabsContent value="tasks" className="p-4 m-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Lesson Tasks</h3>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {completedTasks}/{lesson.tasks.length}
                    </span>
                  </div>

                  <Progress value={progressPercent} className="h-2 mb-4" />

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {lesson.tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group",
                          task.completed
                            ? "bg-success/5 border-success/20"
                            : "bg-secondary/30 border-border/50 hover:border-primary/30 hover:bg-secondary/50"
                        )}
                        onClick={() => toggleTask(task.id)}
                      >
                        <div className="mt-0.5">
                          {task.completed ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", bounce: 0.5 }}
                            >
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            </motion.div>
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-medium text-sm",
                            task.completed ? "text-muted-foreground line-through" : "text-foreground"
                          )}>
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{task.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {progressPercent === 100 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20 text-center"
                    >
                      <Award className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="font-semibold text-success">All tasks completed!</p>
                      <p className="text-sm text-muted-foreground mt-1">You earned +50 XP</p>
                    </motion.div>
                  )}
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="p-4 m-0">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Your Notes</h3>
                  </div>
                  <Textarea
                    placeholder="Take notes while watching the lesson..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  <Button
                    className="w-full gradient-primary"
                    onClick={async () => {
                      if (!id) return;
                      await db.notes.put({
                        lessonId: id,
                        content: notes,
                        lastUpdated: new Date().toISOString()
                      });
                      toast.success('Notes saved to database!');
                    }}
                  >
                    Save Notes
                  </Button>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="p-4 m-0">
                  <div className="flex items-center gap-2 mb-4">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Resources</h3>
                  </div>
                  <div className="space-y-2">
                    {resources.map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                        onClick={() => toast.success('Download started!')}
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <resource.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{resource.name}</p>
                          <p className="text-xs text-muted-foreground">{resource.size}</p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Complete Lesson Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-5 border border-border/50 bg-gradient-to-br from-primary/5 to-backend/5">
              <h3 className="font-semibold text-foreground mb-3">Ready to continue?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete all tasks and watch the video to mark this lesson as done.
              </p>
              <Button
                className="w-full"
                size="lg"
                onClick={async () => {
                  if (!lesson) return;
                  await db.lessons.update(lesson.id, { completed: true });

                  const course = await db.courses.get(lesson.courseId);
                  if (course) {
                    const completedInCourse = (await db.lessons.where('courseId').equals(lesson.courseId).and(l => l.completed).toArray()).length;
                    await db.courses.update(lesson.courseId, { completedLessons: completedInCourse });
                  }

                  toast.success('Lesson completed! +50 XP');
                  navigate('/dashboard');
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Complete Lesson
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => navigate('/assignments')}
              >
                View Assignment
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
