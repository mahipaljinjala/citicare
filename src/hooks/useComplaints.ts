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
