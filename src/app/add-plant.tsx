import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { supabase } from '../../src/lib/supabase';

export default function AddPlantScreen() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');

  const handleAddPlant = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      Alert.alert('Hata', 'Oturum açmış kullanıcı bulunamadı.');
      return;
    }

    const { error } = await supabase.from('plants').insert([
      {
        name: name,
        species: species,
        owner_id: user.id,
      },
    ]);

    if (error) {
      Alert.alert('Ekleme Başarısız', error.message);
    } else {
      Alert.alert('Başarılı', 'Bitki başarıyla eklendi!');
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Bitki Adı" 
        value={name} 
        onChangeText={setName} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Bitki Türü" 
        value={species} 
        onChangeText={setSpecies} 
        style={styles.input} 
      />
      <Button title="Bitkiyi Kaydet" onPress={handleAddPlant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 8 
  }
});