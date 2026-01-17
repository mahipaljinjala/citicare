import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  department_id: string | null;
  department_name?: string | null;
  ward_id: string | null;
  ward_name?: string | null;
  budget: number;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch departments and wards for display names
      const { data: departments } = await supabase
        .from('departments')
        .select('id, name');

      const { data: wards } = await supabase
        .from('wards')
        .select('id, name');

      const deptMap = new Map(departments?.map(d => [d.id, d.name]) || []);
      const wardMap = new Map(wards?.map(w => [w.id, w.name]) || []);

      return (projects || []).map(p => ({
        ...p,
        department_name: p.department_id ? deptMap.get(p.department_id) : null,
        ward_name: p.ward_id ? wardMap.get(p.ward_id) : null,
      })) as Project[];
    },
  });
}