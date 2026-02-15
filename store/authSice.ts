import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types";

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  access_token: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  access_token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.access_token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.access_token = null;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
