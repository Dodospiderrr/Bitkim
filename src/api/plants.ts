import { supabase } from '../lib/supabase';

// Aşama 2'den hatırladığımız Plant tipi (TypeScript arayüzü)
export type Plant = {
  id: string;
  name: string;
  species?: string;
  image_url?: string;
  owner_id: string;
  created_at?: string;
};

// Aşama 2'den hatırladığımız tüm bitkileri çeken fonksiyon
export async function getPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Aşama 5'te eklediğimiz ID'ye göre tek bitki çeken fonksiyon
export async function getPlantById(id: string): Promise<Plant> {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}