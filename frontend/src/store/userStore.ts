import { create } from "zustand";
import { register, login, me, logout } from "../api/users";
import { User } from "@/types/user";

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  registerUser: (
    email: string,
    name: string,
    password: string
  ) => Promise<string | void>;
  loginUser: (email: string, password: string) => Promise<string | void>;
  fetchUser: () => Promise<User | null>;
  logoutUser: () => Promise<string>;
}

const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,

  registerUser: async (email, name, password) => {
    set({ loading: true, error: null });
    try {
      const message = await register(email, name, password);
      return message;
      // Optionnel : Tu peux automatiquement connecter l'utilisateur après l'inscription
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
        set({ isLoggedIn: true, user: userData });
        console.log(userData);
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
        await get().fetchUser(); // Si la connexion réussit, récupération des données utilisateur
        return message; // Retour du message en cas de succès
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
      return message;
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
      set({ error: "Erreur lors de la déconnexion" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;
