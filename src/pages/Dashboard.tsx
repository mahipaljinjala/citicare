import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentComplaints } from '@/components/dashboard/RecentComplaints';
import { ComplaintsBarChart, ComplaintsStatusChart } from '@/components/dashboard/ComplaintsChart';
import { mockComplaints } from '@/data/mockData';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Users,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function CitizenDashboard() {
  const totalComplaints = mockComplaints.length;
  const openComplaints = mockComplaints.filter(
    (c) => c.status === 'submitted' || c.status === 'in_review'
  ).length;
  const inProgress = mockComplaints.filter((c) => c.status === 'in_progress').length;
  const resolved = mockComplaints.filter((c) => c.status === 'resolved').length;

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
          value={totalComplaints}
          icon={FileText}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Open"
          value={openComplaints}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={AlertTriangle}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Resolved"
          value={resolved}
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
          title="Assigned Today"
          value={5}
          icon={FileText}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Pending Action"
          value={12}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="In Progress"
          value={8}
          icon={AlertTriangle}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Resolved This Week"
          value={23}
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Department Dashboard</h1>
        <p className="text-muted-foreground">
          Roads & Infrastructure - Performance Overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={245}
          icon={FileText}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Active Officers"
          value={12}
          icon={Users}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Avg Resolution"
          value="4.5 days"
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Resolution Rate"
          value="81%"
          icon={TrendingUp}
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
          value="1,234"
          change="+12% from last month"
          changeType="positive"
          icon={FileText}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Departments"
          value={15}
          icon={Building2}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Active Officers"
          value={89}
          icon={Users}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Citizen Rating"
          value="4.2/5"
          change="+0.3 this month"
          changeType="positive"
          icon={TrendingUp}
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
