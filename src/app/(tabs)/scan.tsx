import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Bitkileri tarayabilmek için kamera iznine ihtiyacımız var.</Text>
        <Button title="İzin Ver" onPress={requestPermission} color="#2e7d32" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    // Dinamik rotayı TypeScript hatası almadan tetiklemek için 'as any' kullanıyoruz
    router.push(`/plant-detail/${data}` as any);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000',
    padding: 20
  },
  text: { 
    color: '#fff', 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 20 
  }
});