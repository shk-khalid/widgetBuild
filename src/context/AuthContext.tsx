import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
// import { getCurrentUser } from '../lib/auth';
import { setUser, setAccessToken, logout } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { useIdleTimer } from '../hooks/useIdleTimer';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: {
    id: string;
    email: string | null;
    role: 'customer' | 'merchant';
    display_name: string | null;
  } | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isMerchant: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isCustomer: false,
  isMerchant: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  useIdleTimer(); // Initialize idle timer

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session && mounted) {
          const { user } = session;
          const role = (user.user_metadata?.role as 'customer' | 'merchant') || 'customer';
          const name = user.user_metadata?.name || null;

          dispatch(setUser({
            id: user.id,
            email: user.email ?? null,
            display_name: name,
            role,
          }));
          dispatch(setAccessToken(session.access_token));
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (!mounted) return;

        if (event === 'SIGNED_IN' && session) {
          const { user } = session;
          const role = (user.user_metadata?.role as 'customer' | 'merchant') || 'customer';
          const name = user.user_metadata?.name || null;

          dispatch(setUser({
            id: user.id,
            email: user.email ?? null, // Ensure it's string | null
            display_name: name,
            role,
          }));
          dispatch(setAccessToken(session.access_token));
        } else if (event === 'SIGNED_OUT') {
          dispatch(logout());
          navigate('/login');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          dispatch(setAccessToken(session.access_token));
        }

        setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch, navigate]);

  const isAuthenticated = !!user;
  const isCustomer = isAuthenticated && user?.role === 'customer';
  const isMerchant = isAuthenticated && user?.role === 'merchant';

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isCustomer,
    isMerchant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};