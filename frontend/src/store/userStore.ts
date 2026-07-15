import { create } from 'zustand';
import { type UserResponseType } from '@lankaStay/shared/schemes/user/userResponseSchema.ts';
type AuthState = {
  user: UserResponseType;
  accessToken: string;
};
type UserStore = {
  authState: AuthState | null;
  setAuthState: (newAuthState: AuthState | null) => void;
};
export const useUserStore = create<UserStore>((set) => ({
  authState: null,
  setAuthState: (newAuthState) => set({ authState: newAuthState }),
}));
