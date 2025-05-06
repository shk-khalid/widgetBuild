import { axiosInstance } from '../lib/axiosInstance';
import { supabase, type UserRole } from '../lib/supabase';
import { cookieStorage } from '@/lib/cookieStorage';

export async function signUp(email: string, password: string, role: UserRole, display_name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, name: display_name },
        emailRedirectTo: `${window.location.origin}/email-verification`,
      },
    });

    if (error) throw error;

    if (!data.user) {
      return { data, error: null };
    }
    if (role === 'merchant') {
      await axiosInstance.post('/auth/signupMerchant', {
        id: data.user.id,
        name: display_name,
        role: 'merchant',
      });
    }
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.session) throw new Error('No session returned');

    cookieStorage.setAccessToken(data.session.access_token);
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
}


export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { user } = session;
    if (!user) return null;

    const role = user.user_metadata?.role as UserRole || 'customer';

    return {
      id: user.id,
      email: user.email,
      role,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { error };
  }
}
