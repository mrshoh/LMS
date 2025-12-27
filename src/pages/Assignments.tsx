import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Send, ExternalLink, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { Assignment } from '@/types/lms';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusConfig = {
  pending: { 
    icon: Clock, 
    label: 'Pending', 
    color: 'bg-warning/10 text-warning border-warning/20' 
  },
  submitted: { 
    icon: Send, 
    label: 'Submitted', 
    color: 'bg-primary/10 text-primary border-primary/20' 
  },
  reviewed: { 
    icon: AlertCircle, 
    label: 'Reviewed', 
    color: 'bg-backend/10 text-backend border-backend/20' 
  },
  approved: { 
    icon: CheckCircle2, 
    label: 'Approved', 
    color: 'bg-success/10 text-success border-success/20' 
  },
  rejected: { 
    icon: XCircle, 
    label: 'Needs Revision', 
    color: 'bg-destructive/10 text-destructive border-destructive/20' 
  },
};

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(storage.getAssignments());
  const [submissionUrls, setSubmissionUrls] = useState<Record<string, string>>({});

  const handleSubmit = (assignmentId: string) => {
    const url = submissionUrls[assignmentId];
    if (!url) {
      toast.error('Please enter a submission URL');
      return;
    }

    const updatedAssignments = assignments.map(a => 
      a.id === assignmentId 
        ? { ...a, status: 'submitted' as const, submission: url }
        : a
    );
    
    setAssignments(updatedAssignments);
    storage.setAssignments(updatedAssignments);
    setSubmissionUrls(prev => ({ ...prev, [assignmentId]: '' }));
    toast.success('Assignment submitted successfully!');
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Assignments</h1>
        <p className="text-muted-foreground mt-1">Submit your work and track feedback</p>
      </motion.div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusConfig).slice(0, 4).map(([status, config], index) => {
          const count = assignments.filter(a => a.status === status).length;
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", config.color.split(' ')[0])}>
                    <config.icon className={cn("h-4 w-4", config.color.split(' ')[1])} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment, index) => {
          const config = statusConfig[assignment.status];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="p-6 border border-border/50 hover:border-primary/20 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={cn("gap-1", config.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground">{assignment.title}</h3>
                    <p className="text-muted-foreground mt-1">{assignment.description}</p>

                    {/* Submission URL */}
                    {assignment.submission && (
                      <a 
                        href={assignment.submission}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {assignment.submission}
                      </a>
                    )}

                    {/* Feedback */}
                    {assignment.feedback && (
                      <div className="mt-4 p-4 rounded-lg bg-success/5 border border-success/20">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-success">Mentor Feedback</p>
                          {assignment.grade && (
                            <Badge className="bg-success text-success-foreground">
                              Grade: {assignment.grade}/100
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground">{assignment.feedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Submit Form */}
                  {assignment.status === 'pending' && (
                    <div className="lg:w-80 space-y-3">
                      <Input
                        placeholder="GitHub link or submission URL"
                        value={submissionUrls[assignment.id] || ''}
                        onChange={(e) => setSubmissionUrls(prev => ({
                          ...prev,
                          [assignment.id]: e.target.value
                        }))}
                      />
                      <Button 
                        className="w-full" 
                        onClick={() => handleSubmit(assignment.id)}
                      >
                        <Send className="h-4 w-4" />
                        Submit Assignment
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Assignments;
