import { useComplaints, DbComplaint } from '@/hooks/useComplaints';
import { ComplaintCard } from './ComplaintCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, FileText } from 'lucide-react';

export function RecentComplaints() {
  const { data: complaints, isLoading } = useComplaints();
  const recentComplaints = (complaints || []).slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Complaints</h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Complaints</h2>
        <Link to="/complaints">
          <Button variant="ghost" size="sm" className="text-accent">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {recentComplaints.length > 0 ? (
          recentComplaints.map((complaint, index) => (
            <div
              key={complaint.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-slide-up"
            >
              <ComplaintCard complaint={complaint} />
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No complaints yet</p>
            <Link to="/complaints/new" className="mt-3 inline-block">
              <Button variant="accent" size="sm">
                File Your First Complaint
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
