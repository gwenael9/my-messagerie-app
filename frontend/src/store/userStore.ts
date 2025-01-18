import { getPublicUsers } from "@/api/users";
import { User } from "@/types/user";
import { create } from "zustand";

interface UserState {
  usersPublic: User[] | [];
  fetchUsersPublic: () => Promise<void>;
  loading: boolean;
}

const useUserStore = create<UserState>((set) => ({
  usersPublic: [],
  loading: false,

  fetchUsersPublic: async () => {
    set({ loading: true });
    try {
      const users = await getPublicUsers();
      set({ usersPublic: users });
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des utilisateurs public",
        err
      );
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;