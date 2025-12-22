import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Zone {
  id: string;
  name: string;
  code: string;
}

export interface Ward {
  id: string;
  zone_id: string;
  name: string;
  code: string;
}

export interface Area {
  id: string;
  ward_id: string;
  name: string;
  code: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Zone[];
    },
  });
}

export function useWards(zoneId?: string) {
  return useQuery({
    queryKey: ['wards', zoneId],
    queryFn: async () => {
      let query = supabase.from('wards').select('*').order('name');
      
      if (zoneId) {
        query = query.eq('zone_id', zoneId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Ward[];
    },
    enabled: !zoneId || !!zoneId,
  });
}

export function useAreas(wardId?: string) {
  return useQuery({
    queryKey: ['areas', wardId],
    queryFn: async () => {
      let query = supabase.from('areas').select('*').order('name');
      
      if (wardId) {
        query = query.eq('ward_id', wardId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Area[];
    },
    enabled: !wardId || !!wardId,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Department[];
    },
  });
}
