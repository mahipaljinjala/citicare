import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  department_id: string | null;
  department_name?: string | null;
  notification_email: boolean;
  notification_push: boolean;
  notification_status_updates: boolean;
  notification_comments: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      // Fetch department name if assigned
      let department_name = null;
      if (profile?.department_id) {
        const { data: dept } = await supabase
          .from('departments')
          .select('name')
          .eq('id', profile.department_id)
          .single();
        department_name = dept?.name || null;
      }

      return { ...profile, department_name } as Profile;
    },
    enabled: !!session?.user?.id,
  });
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  notification_email?: boolean;
  notification_push?: boolean;
  notification_status_updates?: boolean;
  notification_comments?: boolean;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}