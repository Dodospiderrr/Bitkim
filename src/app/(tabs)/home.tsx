import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

type HomeData = {
  quote: {
    text: string;
    author: string;
  };
  myPlants: {
    id: string;
    name: string;
    species: string;
    coverPhotoPath: string | null;
    photoCount: number;
  }[];
};

export default function HomeScreen() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase.rpc('get_home');

      if (error) throw error;
      if (result) {
        setData(result as HomeData);
      }
    } catch (error: any) {
      console.error('Ana sayfa verisi çekilemedi:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Günün Sözü Alanı */}
      {data?.quote && (
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{data.quote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {data.quote.author}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Bitkilerim</Text>

      {/* Bitki Listesi */}
      <FlatList
        data={data?.myPlants || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const coverUrl = item.coverPhotoPath
            ? supabase.storage.from('plant-photos').getPublicUrl(item.coverPhotoPath).data.publicUrl
            : null;

          return (
            <TouchableOpacity 
              style={styles.plantCard}
              onPress={() => router.push({ pathname: '/gallery', params: { plantId: item.id } } as any)}
            >
              {coverUrl ? (
                <Image source={{ uri: coverUrl }} style={styles.plantImage} />
              ) : (
                <View style={[styles.plantImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>🌱</Text>
                </View>
              )}
              <View style={styles.plantInfo}>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantSpecies}>{item.species || 'Tür belirtilmemiş'}</Text>
                <Text style={styles.photoCountText}>{item.photoCount} Fotoğraf</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  quoteCard: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1b5e20',
    marginBottom: 6,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#388e3c',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  plantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  plantInfo: {
    marginLeft: 12,
    flex: 1,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  plantSpecies: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  photoCountText: {
    fontSize: 12,
    color: '#2e7d32',
    marginTop: 4,
    fontWeight: '500',
  },
});