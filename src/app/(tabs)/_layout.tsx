import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="home"
        options={{ title: 'Ana Sayfa' }}
      />
      <Tabs.Screen
        name="scan"
        options={{ title: 'QR Okut' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil' }}
      />
    </Tabs>
  );
}