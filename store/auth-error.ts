import { create } from "zustand";

type Store = {
  error: string | null;
  setError: (error: string | null) => void;
};

export const useAuthErrorStore = create<Store>((set) => ({
  error: "",
  setError: (error) => set(() => ({ error })),
}));
