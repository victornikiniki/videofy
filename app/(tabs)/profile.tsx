import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

export default function Profile() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get current user info
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email || 'No Email');
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    // Router will automatically redirect to /(auth)/login due to the listener in app/_layout.tsx
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.avatar} 
        />
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.role}>Job Seeker</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Sign Out" onPress={handleSignOut} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, backgroundColor: '#ddd' },
  email: { fontSize: 18, fontWeight: 'bold' },
  role: { fontSize: 14, color: 'gray', marginTop: 5 },
  actions: { marginTop: 20 }
});