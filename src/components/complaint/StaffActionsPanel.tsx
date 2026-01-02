import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateComplaint, useDepartments, DbComplaint } from '@/hooks/useComplaints';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings, Building2, AlertTriangle } from 'lucide-react';

interface StaffActionsPanelProps {
  complaint: DbComplaint;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function StaffActionsPanel({ complaint }: StaffActionsPanelProps) {
  const { toast } = useToast();
  const updateComplaint = useUpdateComplaint();
  const { data: departments } = useDepartments();

  const [status, setStatus] = useState(complaint.status);
  const [departmentId, setDepartmentId] = useState(complaint.department_id || '');
  const [priority, setPriority] = useState(complaint.priority);

  const hasChanges =
    status !== complaint.status ||
    departmentId !== (complaint.department_id || '') ||
    priority !== complaint.priority;

  const handleUpdate = async () => {
    try {
      await updateComplaint.mutateAsync({
        id: complaint.id,
        status,
        department_id: departmentId || null,
        priority,
      });
      toast({
        title: 'Complaint updated',
        description: 'The complaint has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Staff Actions
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status" className="flex items-center gap-1">
            Status
          </Label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            Department
          </Label>
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger id="department">
              <SelectValue placeholder="Assign department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {departments?.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Priority
          </Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Set priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="accent"
          disabled={!hasChanges || updateComplaint.isPending}
          onClick={handleUpdate}
        >
          {updateComplaint.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
