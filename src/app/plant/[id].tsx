import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bitki Detayı</Text>
      <Text style={styles.subtitle}>Gelen Bitki ID: {id}</Text>

      <Button
        title="Kamerayı Aç"
        onPress={() => router.push(`/plant/${id}/camera` as any)}
      />
      <Button
        title="Galeriye Git"
        onPress={() => router.push(`/plant/${id}/gallery` as any)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 18, color: 'green' },
});