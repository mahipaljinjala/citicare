import { mockComplaints } from '@/data/mockData';
import { ComplaintCard } from './ComplaintCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function RecentComplaints() {
  const recentComplaints = mockComplaints.slice(0, 3);

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
        {recentComplaints.map((complaint, index) => (
          <div
            key={complaint.id}
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-slide-up"
          >
            <ComplaintCard complaint={complaint} />
          </div>
        ))}
      </div>
    </div>
  );
}
