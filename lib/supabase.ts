import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR KEYS FROM SUPABASE DASHBOARD -> SETTINGS -> API
const supabaseUrl = 'https://uhycfpcbgbckcvyabqjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeWNmcGNiZ2Jja2N2eWFicWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2ODQyNzIsImV4cCI6MjA4MzI2MDI3Mn0.Ggu_AOiMKAD6LIwzUGdxvrzuYTO6BKzpAp2dgM7OWTU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});