import { useState } from 'react';
import { useComplaints } from '@/hooks/useComplaints';
import { ComplaintCard } from '@/components/dashboard/ComplaintCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, PlusCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const complaintCategories = [
  { value: 'roads', label: 'Roads & Potholes', icon: '🛣️' },
  { value: 'water', label: 'Water Supply', icon: '💧' },
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'garbage', label: 'Garbage Collection', icon: '🗑️' },
  { value: 'sewage', label: 'Sewage & Drainage', icon: '🚰' },
  { value: 'street_lights', label: 'Street Lights', icon: '💡' },
  { value: 'parks', label: 'Parks & Gardens', icon: '🌳' },
  { value: 'other', label: 'Other Issues', icon: '📋' },
];

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'closed', label: 'Closed' },
];

export default function Complaints() {
  const { user } = useAuth();
  const { data: complaints, isLoading } = useComplaints();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredComplaints = (complaints || []).filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaint_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || complaint.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusCounts = (complaints || []).reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === 'citizen' ? 'My Complaints' : 'All Complaints'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'citizen'
              ? 'View and track all your submitted complaints'
              : 'Manage and update complaint statuses'}
          </p>
        </div>
        {user?.role === 'citizen' && (
          <Link to="/complaints/new">
            <Button variant="accent">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Complaint
            </Button>
          </Link>
        )}
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.slice(1).map((status) => (
          <Badge
            key={status.value}
            variant={status.value.replace('_', '-') as any}
            className="cursor-pointer"
            onClick={() =>
              setStatusFilter(statusFilter === status.value ? 'all' : status.value)
            }
          >
            {status.label}: {statusCounts[status.value] || 0}
          </Badge>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {complaintCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  {cat.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint, index) => (
            <div
              key={complaint.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-slide-up"
            >
              <ComplaintCard complaint={complaint} />
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No complaints found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {complaints?.length === 0
                ? "You haven't filed any complaints yet."
                : 'Try adjusting your filters or search query.'}
            </p>
            {user?.role === 'citizen' && complaints?.length === 0 && (
              <Link to="/complaints/new">
                <Button variant="accent">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  File Your First Complaint
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
