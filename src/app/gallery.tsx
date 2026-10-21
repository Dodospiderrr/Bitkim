import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

// Ekran genişliğine göre grid karelerini hesaplayalım (3 sütunlu yapı)
const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - 32 - 16) / 3; // Kenar boşlukları ve aralarındaki boşluklar hesaba katıldı

type PhotoItem = {
  id: string;
  path: string;
  created_at: string;
  publicUrl?: string;
};

export default function GalleryScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (plantId) {
      fetchPlantPhotos();
    }
  }, [plantId]);

  // Fotoğrafları Supabase'den çeken fonksiyon
  const fetchPlantPhotos = async () => {
    try {
      setLoading(true);
      
      // 1. 'photos' tablosundan bu bitkiye ait kayıtları çek
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('plant_id', plantId)
        .order('created_at', { ascending: false }); // En yeni fotoğraf en başta

      if (error) throw new Error(error.message);

      if (data) {
        // 2. Her bir kayıt için Storage'dan public URL oluşturalım
        const photosWithUrls = data.map((photo) => {
          const { data: urlData } = supabase.storage
            .from('plant-photos')
            .getPublicUrl(photo.path);

          return {
            ...photo,
            publicUrl: urlData.publicUrl,
          };
        });

        setPhotos(photosWithUrls);
      }
    } catch (error: any) {
      console.error('Galeri yükleme hatası:', error.message);
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

  if (photos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Bu bitkiye ait henüz hiç fotoğraf eklenmemiş.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.publicUrl }} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  gridContainer: {
    padding: 16,
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});