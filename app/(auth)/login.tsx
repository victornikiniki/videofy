import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAuth(type: 'LOGIN' | 'SIGNUP') {
    setLoading(true);
    let error;

    if (type === 'LOGIN') {
      const res = await supabase.auth.signInWithPassword({ email, password });
      error = res.error;
    } else {
      const res = await supabase.auth.signUp({ email, password });
      error = res.error;
      if (!error) Alert.alert('Success', 'Check your email to verify!');
    }

    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VideoFy</Text>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        style={styles.input}
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input}
      />
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#8A2BE2' }]} 
        onPress={() => handleAuth('LOGIN')}
      >
        <Text style={styles.btnText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#333' }]} 
        onPress={() => handleAuth('SIGNUP')}
      >
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#8A2BE2' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnText: { color: 'white', fontWeight: 'bold' }
});