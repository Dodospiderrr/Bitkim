import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { getPlants, Plant } from '../../api/plants';

export default function HomeScreen() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlants();
      setPlants(data);
    } catch (err: any) {
      setError(err.message || 'Bitkiler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  // 1. Durum: Yükleniyor (Loading)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.infoText}>Bitkiler yükleniyor...</Text>
      </View>
    );
  }

  // 2. Durum: Hata Oluştu (Error)
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.infoText, { color: 'red' }]}>Hata: {error}</Text>
        <Button title="Tekrar Dene" onPress={fetchPlants} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bitkilerim</Text>

      {/* 3. Durum: Boş Liste (Empty) */}
      {plants.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.infoText}>Henüz hiç bitki eklememişsiniz.</Text>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.plantName}>{item.name}</Text>
              <Text style={styles.plantSpecies}>{item.species}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e7d32',
  },
  infoText: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  plantSpecies: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 4,
  },
});