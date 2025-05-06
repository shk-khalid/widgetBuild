import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../../lib/supabase';
// import { encryptData, decryptData } from '../../lib/encryption';

interface AuthState {
  user: {
    id: string;
    email: string | null;
    display_name: string | null;
    role: UserRole;
  } | null;
  accessToken: string | null;
  lastActivity: number;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  lastActivity: Date.now()
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.lastActivity = Date.now();
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.lastActivity = Date.now();
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.lastActivity = 0;
    }
  }
});

export const { setUser, setAccessToken, updateLastActivity, logout } = authSlice.actions;
export default authSlice.reducer;