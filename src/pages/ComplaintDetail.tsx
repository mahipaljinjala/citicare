import { useParams, useNavigate } from 'react-router-dom';
import { mockComplaints } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Building2,
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  in_review: 'In Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  reopened: 'Reopened',
};

const statusIcons: Record<string, typeof CheckCircle> = {
  submitted: FileCheck,
  in_review: Clock,
  in_progress: AlertCircle,
  resolved: CheckCircle,
  reopened: AlertCircle,
};

const categoryIcons: Record<string, string> = {
  roads: '🛣️',
  water: '💧',
  electricity: '⚡',
  garbage: '🗑️',
  sewage: '🚰',
  street_lights: '💡',
  parks: '🌳',
  other: '📋',
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comment, setComment] = useState('');

  const complaint = mockComplaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Complaint Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The complaint you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate('/complaints')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Complaints
        </Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[complaint.status];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{categoryIcons[complaint.category]}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold">{complaint.title}</h1>
                <Badge variant={complaint.status.replace('_', '-') as any}>
                  {statusLabels[complaint.status]}
                </Badge>
                {complaint.priority === 'urgent' && (
                  <Badge variant="urgent">Urgent</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">ID: {complaint.id}</p>
            </div>
          </div>
          {user?.role !== 'citizen' && complaint.status !== 'resolved' && (
            <Button variant="accent">Update Status</Button>
          )}
        </div>

        <p className="text-muted-foreground mb-6">{complaint.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{complaint.location.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Filed On</p>
              <p className="font-medium">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-medium">{complaint.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Assigned To</p>
              <p className="font-medium">
                {complaint.assignedOfficerName || 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Status Timeline
        </h2>
        <div className="relative">
          {complaint.timeline.map((event, index) => {
            const Icon = statusIcons[event.status];
            const isLast = index === complaint.timeline.length - 1;
            return (
              <div key={event.id} className="flex gap-4 pb-6 last:pb-0">
                <div className="relative">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      isLast ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {!isLast && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={event.status.replace('_', '-') as any} className="text-xs">
                      {statusLabels[event.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{event.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    By {event.userName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({complaint.comments.length})
        </h2>

        {complaint.comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {complaint.comments.map((comment) => (
              <div
                key={comment.id}
                className={cn(
                  'rounded-lg p-4',
                  comment.userRole === 'citizen'
                    ? 'bg-secondary/50'
                    : 'bg-accent/5 border border-accent/20'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {comment.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{comment.userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {comment.userRole.replace('_', ' ')}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{comment.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">No comments yet.</p>
        )}

        {/* Add Comment */}
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Button variant="accent" disabled={!comment.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Send Comment
          </Button>
        </div>
      </div>

      {/* Rating (for resolved complaints) */}
      {complaint.status === 'resolved' && user?.role === 'citizen' && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Rate Resolution
          </h2>
          {complaint.rating ? (
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-6 w-6',
                      star <= complaint.rating!
                        ? 'fill-warning text-warning'
                        : 'text-muted-foreground'
                    )}
                  />
                ))}
              </div>
              {complaint.feedback && (
                <p className="text-sm text-muted-foreground">
                  "{complaint.feedback}"
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star}>
                    <Star className="h-8 w-8 text-muted-foreground hover:fill-warning hover:text-warning transition-colors" />
                  </button>
                ))}
              </div>
              <Textarea placeholder="Share your feedback..." rows={2} className="mb-3" />
              <Button variant="accent">Submit Rating</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
