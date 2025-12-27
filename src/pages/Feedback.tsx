import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Check, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import { MentorMessage } from '@/types/lms';
import { cn } from '@/lib/utils';

const Feedback = () => {
  const [messages, setMessages] = useState<MentorMessage[]>(storage.getMessages());

  const markAsRead = (messageId: string) => {
    const updatedMessages = messages.map(m =>
      m.id === messageId ? { ...m, read: true } : m
    );
    setMessages(updatedMessages);
    storage.setMessages(updatedMessages);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Mentor Feedback</h1>
          <p className="text-muted-foreground mt-1">Messages and notes from your mentors</p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{unreadCount} new</span>
          </div>
        )}
      </motion.div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No messages yet</p>
          </Card>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "p-6 border transition-all",
                  message.read 
                    ? "border-border/50" 
                    : "border-primary/30 bg-primary/5 shadow-md"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0",
                    message.read ? "bg-secondary" : "gradient-primary"
                  )}>
                    <User className={cn(
                      "h-6 w-6",
                      message.read ? "text-muted-foreground" : "text-primary-foreground"
                    )} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{message.mentorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(message.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {!message.read && (
                        <div className="h-3 w-3 rounded-full bg-primary animate-pulse flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="mt-3 text-foreground leading-relaxed">{message.message}</p>

                    {!message.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 gap-2 text-primary"
                        onClick={() => markAsRead(message.id)}
                      >
                        <Check className="h-4 w-4" />
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Help Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 border-dashed border-2 border-border bg-secondary/30">
          <div className="text-center">
            <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold text-foreground">Need help?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Contact your mentor through the Najot Ta'lim platform or during office hours.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Feedback;
