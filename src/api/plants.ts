import { supabase } from '../lib/supabase';

export interface Plant {
  id: string;
  name: string;
  species: string;
  created_at: string;
  owner_id?: string;
}

export const getPlants = async (): Promise<Plant[]> => {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Plant[];
};