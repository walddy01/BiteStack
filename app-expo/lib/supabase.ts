import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = "https://samymupyfbksaczyfyrj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXltdXB5ZmJrc2FjenlmeXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzODI4NjIsImV4cCI6MjA1Nzk1ODg2Mn0.O9gLYFzm5Rm5rcBVa8N1y17HmEtRbtmSwrfFZgp1SEI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
