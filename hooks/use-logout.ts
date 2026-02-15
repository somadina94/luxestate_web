import { useCallback } from "react";
import { useAppDispatch, logout } from "@/store";
import { clearAuthCookie } from "@/lib/auth-cookie";

export function useLogout() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    clearAuthCookie();
    dispatch(logout());
  }, [dispatch]);
}
