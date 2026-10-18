import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ana Sayfa</Text>
      <Button
        title="Bitki Detayına Git (ID: 42)"
        onPress={() => router.push('/plant/42' as any)}
      />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Bitki Ekle"
          onPress={() => router.push('/add-plant' as any)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  title: { fontSize: 22, fontWeight: 'bold' },
});