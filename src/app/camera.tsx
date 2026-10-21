import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function CameraScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Fotoğraf çekebilmek için kamera iznine ihtiyacımız var.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || loading) return;

    try {
      setLoading(true);

      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: true,
      });

      if (!photo || !photo.uri) {
        throw new Error('Fotoğraf alınamadı.');
      }

      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const filename = `${plantId}/${Date.now()}.jpg`;

      const response = await fetch(manipResult.uri);
      const blob = await response.blob();

      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(blob);
      });

      // Supabase Storage'a yükleme (Tip uyumsuzluğunu gidermek için 'as any' eklendi)
      const { data: storageData, error: storageError } = await supabase.storage
        .from('plant-photos')
        .upload(filename, arrayBuffer as any, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (storageError) {
        throw new Error(`Storage yükleme hatası: ${storageError.message}`);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı.');

      const { error: dbError } = await supabase.from('photos').insert({
        plant_id: plantId,
        user_id: user.id,
        path: storageData.path,
      });

      if (dbError) {
        await supabase.storage.from('plant-photos').remove([filename]);
        throw new Error(`Veritabanı kayıt hatası: ${dbError.message}`);
      }

      Alert.alert('Başarılı', 'Bitki fotoğrafı başarıyla kaydedildi!', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);

    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Fotoğraf yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#000' 
  },
  camera: { 
    flex: 1 
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  text: { 
    color: '#fff', 
    textAlign: 'center', 
    marginBottom: 20, 
    fontSize: 16, 
    paddingHorizontal: 20 
  },
  permissionButton: { 
    backgroundColor: '#2e7d32', 
    padding: 12, 
    borderRadius: 8, 
    alignSelf: 'center' 
  },
  permissionButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});