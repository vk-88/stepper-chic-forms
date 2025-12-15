import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => { success: boolean; isAdmin: boolean };
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

// Mock users storage
const getStoredUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        // Admin check
        if (email === 'admin@admin.com' && password === 'admin123') {
          const adminUser: User = {
            id: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
            isAdmin: true,
          };
          set({ user: adminUser, isAuthenticated: true });
          return { success: true, isAdmin: true };
        }

        // Check stored users (mock validation)
        const users = getStoredUsers();
        const user = users.find((u) => u.email === email);
        
        if (user) {
          set({ user: { ...user, isAdmin: false }, isAuthenticated: true });
          return { success: true, isAdmin: false };
        }

        // For demo purposes, allow any login
        const mockUser: User = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          isAdmin: false,
        };
        set({ user: mockUser, isAuthenticated: true });
        return { success: true, isAdmin: false };
      },

      signup: (name: string, email: string, _password: string) => {
        const users = getStoredUsers();
        
        // Check if user already exists
        if (users.some((u) => u.email === email)) {
          return false;
        }

        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          isAdmin: false,
        };

        saveUsers([...users, newUser]);
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
