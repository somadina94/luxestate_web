import AuthSlice, { AuthState, login, logout, setUser } from "./authSice";
import store, {
  useAppDispatch,
  RootState,
  useAppSelector,
  persistor,
} from "./store";

export {
  AuthSlice,
  type AuthState,
  login,
  logout,
  setUser,
  useAppDispatch,
  useAppSelector,
  type RootState,
  store,
  persistor,
};
export type AppDispatch = typeof store.dispatch;
