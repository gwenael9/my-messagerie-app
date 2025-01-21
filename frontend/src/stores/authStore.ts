import { create } from "zustand";
import { register, login, me, logout } from "../api/auth";
import { User } from "@/types/user";
import useUserStore from "./userStore";
import useMessageStore from "./messageStore";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  friends: User[] | [];
  loading: boolean;
  error: string | null;
  registerUser: (
    email: string,
    firstname: string,
    lastname: string,
    password: string
  ) => Promise<string | void>;
  loginUser: (email: string, password: string) => Promise<string | void>;
  fetchUser: () => Promise<User | null>;
  logoutUser: () => Promise<string>;
}

const userStore = useUserStore.getState();
const messageStore = useMessageStore.getState();

const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
  friends: [],

  registerUser: async (email, firstname, lastname, password) => {
    set({ loading: true, error: null });
    try {
      return await register(email, firstname, lastname, password);
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      set({ error: "Erreur lors de l'inscription" });
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const userData = await me();
      if (userData) {
        set({ isLoggedIn: true, user: userData, friends: userData.friends });
        return userData;
      } else {
        set({ isLoggedIn: false, user: null });
        return null;
      }
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur :",
        err
      );
      set({
        error: "Erreur lors de la récupération des informations utilisateur",
      });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  loginUser: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const message = await login(email, password);
      if (message) {
        await get().fetchUser();

        // re-fetch les users publics
        await userStore.fetchUsersPublic();

        // refetch le nombre de message non lus
        await messageStore.fetchNbMessagesNoRead();

        return message;
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      set({ error: "Erreur lors de la connexion" });
    } finally {
      set({ loading: false });
    }
  },

  logoutUser: async () => {
    set({ loading: true, error: null });
    try {
      const message = await logout();
      set({ isLoggedIn: false, user: null });

      // re-fetch les users publics
      await userStore.fetchUsersPublic();

      return message;
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
      set({ error: "Erreur lors de la déconnexion" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
