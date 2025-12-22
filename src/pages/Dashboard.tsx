import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentComplaints } from '@/components/dashboard/RecentComplaints';
import { ComplaintsBarChart, ComplaintsStatusChart } from '@/components/dashboard/ComplaintsChart';
import { useComplaintStats } from '@/hooks/useComplaints';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Users,
  Building2,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function CitizenDashboard() {
  const { data: stats, isLoading } = useComplaintStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Track your complaints and access civic services.
          </p>
        </div>
        <Link to="/complaints/new">
          <Button variant="accent" size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            File New Complaint
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={stats?.total || 0}
          icon={FileText}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="In Progress"
          value={stats?.in_progress || 0}
          icon={AlertTriangle}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          iconColor="bg-success/10 text-success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ComplaintsBarChart />
        <ComplaintsStatusChart />
      </div>

      {/* Recent Complaints */}
      <RecentComplaints />
    </div>
  );
}

function OfficerDashboard() {
  const { data: stats, isLoading } = useComplaintStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Officer Dashboard</h1>
        <p className="text-muted-foreground">
          Manage assigned complaints and update status.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={stats?.total || 0}
          icon={FileText}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="In Progress"
          value={stats?.in_progress || 0}
          icon={AlertTriangle}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          iconColor="bg-success/10 text-success"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ComplaintsBarChart />
        <ComplaintsStatusChart />
      </div>

      <RecentComplaints />
    </div>
  );
}

function DepartmentHeadDashboard() {
  const { data: stats, isLoading } = useComplaintStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Department Dashboard</h1>
        <p className="text-muted-foreground">
          Department Performance Overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={stats?.total || 0}
          icon={FileText}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="In Progress"
          value={stats?.in_progress || 0}
          icon={AlertTriangle}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          iconColor="bg-success/10 text-success"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ComplaintsBarChart />
        <ComplaintsStatusChart />
      </div>

      <RecentComplaints />
    </div>
  );
}

function AdminDashboard() {
  const { data: stats, isLoading } = useComplaintStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          City-wide civic services overview.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={stats?.total || 0}
          icon={FileText}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="In Progress"
          value={stats?.in_progress || 0}
          icon={AlertTriangle}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          iconColor="bg-success/10 text-success"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ComplaintsBarChart />
        <ComplaintsStatusChart />
      </div>

      <RecentComplaints />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'officer':
      return <OfficerDashboard />;
    case 'department_head':
      return <DepartmentHeadDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <CitizenDashboard />;
  }
}
