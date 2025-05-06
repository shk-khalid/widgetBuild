import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${key}=`))
            ?.split('=')[1];
          return value ? decodeURIComponent(value) : null;
        } catch {
          return null;
        }
      },
      setItem: (key, value) => {
        // Set HTTP-only cookie that expires in 12 hours
        const encodedValue = encodeURIComponent(value);
        document.cookie = `${key}=${encodedValue}; path=/; max-age=${12 * 60 * 60}; secure; samesite=strict`;
      },
      removeItem: (key) => {
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
      },
    },
  },
});

export type UserRole = 'customer' | 'merchant';

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  display_name: string;
}
