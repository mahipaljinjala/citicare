import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DbComplaint {
  id: string;
  complaint_number: string;
  user_id: string | null;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department_id: string | null;
  assigned_to: string | null;
  zone_id: string | null;
  ward_id: string | null;
  area_id: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  departments?: { name: string } | null;
  zones?: { name: string } | null;
  wards?: { name: string } | null;
  areas?: { name: string } | null;
  profiles?: { full_name: string } | null;
  complaint_images?: { id: string; url: string; caption: string | null }[];
}

export function useComplaints() {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ['complaints', user?.id],
    queryFn: async () => {
      let query = supabase
        .from('complaints')
        .select(`
          *,
          departments(name),
          zones(name),
          wards(name),
          areas(name),
          complaint_images(id, url, caption)
        `)
        .order('created_at', { ascending: false });

      // Citizens only see their own complaints
      if (user?.role === 'citizen' && user.id) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as DbComplaint[];
    },
    enabled: !!session,
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          departments(name),
          zones(name),
          wards(name),
          areas(name),
          complaint_images(id, url, caption)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as DbComplaint | null;
    },
    enabled: !!id,
  });
}

interface CreateComplaintData {
  title: string;
  description: string;
  category: string;
  address: string;
  zone_id?: string;
  ward_id?: string;
  area_id?: string;
  images?: File[];
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateComplaintData) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      // Upload images first if any
      const imageUrls: string[] = [];
      
      if (data.images && data.images.length > 0) {
        for (const file of data.images) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('complaint-images')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          const { data: urlData } = supabase.storage
            .from('complaint-images')
            .getPublicUrl(fileName);
          
          imageUrls.push(urlData.publicUrl);
        }
      }

      // Create the complaint
      const { data: complaint, error: complaintError } = await supabase
        .from('complaints')
        .insert({
          user_id: session.user.id,
          title: data.title,
          description: data.description,
          category: data.category,
          address: data.address,
          zone_id: data.zone_id || null,
          ward_id: data.ward_id || null,
          area_id: data.area_id || null,
        } as any)
        .select()
        .single();
      
      if (complaintError) throw complaintError;

      // Add images to complaint_images table
      if (imageUrls.length > 0) {
        const imageRecords = imageUrls.map(url => ({
          complaint_id: complaint.id,
          url,
        }));
        
        const { error: imageError } = await supabase
          .from('complaint_images')
          .insert(imageRecords as any);
        
        if (imageError) throw imageError;
      }

      return complaint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}

export function useComplaintStats() {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ['complaint-stats', user?.id],
    queryFn: async () => {
      let query = supabase
        .from('complaints')
        .select('status', { count: 'exact' });

      if (user?.role === 'citizen' && user.id) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        rejected: 0,
        closed: 0,
      };

      data?.forEach((item: { status: string }) => {
        if (item.status in stats) {
          stats[item.status as keyof typeof stats]++;
        }
      });

      return stats;
    },
    enabled: !!session,
  });
}

export function useMonthlyComplaintStats() {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ['monthly-complaint-stats', user?.id],
    queryFn: async () => {
      // Get complaints from the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      let query = supabase
        .from('complaints')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString());

      if (user?.role === 'citizen' && user.id) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Group by month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Initialize last 6 months with 0
      const monthlyData: { month: string; complaints: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        monthlyData.push({ month: months[monthIndex], complaints: 0 });
      }

      // Count complaints per month
      data?.forEach((complaint: { created_at: string }) => {
        const complaintDate = new Date(complaint.created_at);
        const monthIndex = complaintDate.getMonth();
        const monthName = months[monthIndex];
        
        const monthEntry = monthlyData.find(m => m.month === monthName);
        if (monthEntry) {
          monthEntry.complaints++;
        }
      });

      return monthlyData;
    },
    enabled: !!session,
  });
}

export interface DbComment {
  id: string;
  complaint_id: string;
  user_id: string | null;
  content: string;
  is_internal: boolean;
  created_at: string;
  profiles?: { full_name: string } | null;
}

export function useComplaintComments(complaintId: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['complaint-comments', complaintId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('complaint_comments')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Fetch user names separately
      const comments = data || [];
      const userIds = [...new Set(comments.filter(c => c.user_id).map(c => c.user_id))];
      
      let profilesMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds as string[]);
        
        profiles?.forEach(p => {
          profilesMap[p.id] = p.full_name;
        });
      }
      
      return comments.map(c => ({
        ...c,
        profiles: c.user_id ? { full_name: profilesMap[c.user_id] || 'Unknown' } : null,
      })) as DbComment[];
    },
    enabled: !!complaintId && !!session,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async ({ complaintId, content }: { complaintId: string; content: string }) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('complaint_comments')
        .insert({
          complaint_id: complaintId,
          user_id: session.user.id,
          content,
          is_internal: false,
        } as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['complaint-comments', variables.complaintId] });
    },
  });
}

interface UpdateComplaintData {
  status?: 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'closed';
  department_id?: string | null;
  assigned_to?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export function useUpdateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, oldStatus, ...data }: UpdateComplaintData & { id: string; oldStatus?: string }) => {
      const updateData: Record<string, any> = { ...data };
      
      // Set resolved_at when status changes to resolved
      if (data.status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data: result, error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', id)
        .select('*, departments(name)')
        .single();
      
      if (error) throw error;

      // Send email notification if status changed
      if (data.status && oldStatus && data.status !== oldStatus) {
        try {
          await supabase.functions.invoke('send-status-notification', {
            body: {
              complaint_id: result.id,
              old_status: oldStatus,
              new_status: data.status,
              complaint_number: result.complaint_number,
              complaint_title: result.title,
            },
          });
          console.log('Status notification sent');
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
          // Don't throw - notification failure shouldn't block the update
        }
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint', data.id] });
      queryClient.invalidateQueries({ queryKey: ['complaint-stats'] });
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, code')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
}

export interface Officer {
  id: string;
  full_name: string;
  email: string;
  department_id: string | null;
}

export function useOfficers(departmentId?: string | null) {
  return useQuery({
    queryKey: ['officers', departmentId],
    queryFn: async () => {
      // Get all users with officer role
      const { data: officerRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'officer');
      
      if (rolesError) throw rolesError;
      
      const officerIds = officerRoles?.map(r => r.user_id) || [];
      
      if (officerIds.length === 0) return [];
      
      // Get profiles for these officers
      let query = supabase
        .from('profiles')
        .select('id, full_name, email, department_id')
        .in('id', officerIds)
        .order('full_name');
      
      // Filter by department if specified
      if (departmentId) {
        query = query.eq('department_id', departmentId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Officer[];
    },
  });
}
