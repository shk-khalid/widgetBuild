import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateLastActivity } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { signOut } from '../service/authService';
import { toast } from 'react-hot-toast';

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

export const useIdleTimer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lastActivity = useSelector((state: RootState) => state.auth.lastActivity);
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.user);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      dispatch(updateLastActivity());
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const interval = setInterval(() => {
      const now = Date.now();
      if (lastActivity && (now - lastActivity) > IDLE_TIMEOUT) {
        signOut();
        dispatch(logout());
        navigate('/login');
        toast.error('Session expired due to inactivity');
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [dispatch, navigate, lastActivity, isAuthenticated]);
};