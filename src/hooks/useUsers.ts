import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  department_id: string | null;
  department_name: string | null;
  role: string;
  created_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: string;
  departmentId?: string;
}

export interface UpdateUserData {
  userId: string;
  role?: string;
  departmentId?: string | null;
  fullName?: string;
  phone?: string;
}

export function useUsers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Only admins should fetch all users
      if (user?.role !== 'admin') {
        return [];
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, avatar_url, department_id, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles separately
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch departments separately
      const { data: departments, error: deptError } = await supabase
        .from('departments')
        .select('id, name');

      if (deptError) throw deptError;

      const rolesMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);
      const deptMap = new Map(departments?.map(d => [d.id, d.name]) || []);

      return (profiles || []).map(p => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        phone: p.phone,
        avatar_url: p.avatar_url,
        department_id: p.department_id,
        department_name: p.department_id ? deptMap.get(p.department_id) || null : null,
        role: rolesMap.get(p.id) || 'citizen',
        created_at: p.created_at,
      })) as User[];
    },
    enabled: user?.role === 'admin',
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('create-test-user', {
        body: data,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create user');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: role as 'admin' | 'department_head' | 'officer' | 'citizen' })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUserDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, departmentId }: { userId: string; departmentId: string | null }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ department_id: departmentId })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
