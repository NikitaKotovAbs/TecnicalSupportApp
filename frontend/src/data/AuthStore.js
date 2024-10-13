// store/authStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

// Функция для загрузки пользователя из localStorage
const loadUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Функция для сохранения пользователя в localStorage
const saveUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Функция для удаления пользователя из localStorage
const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

const AuthStore = create((set) => ({
  user: loadUserFromLocalStorage(),
  isLoading: false,
  error: null,

  // Регистрация пользователя
  register: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post( `${API_URL}/api/register/`, { username, password });
      const userData = response.data;

      // Сохраняем пользователя в состояние и localStorage
      set({ user: userData, isLoading: false });
      saveUserToLocalStorage(userData);
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Ошибка регистрации',
        isLoading: false,
      });
    }
  },

  // Вход пользователя
  login: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/api/login/`, { username, password });
      const userData = response.data;

      // Сохраняем пользователя в состояние и localStorage
      set({ user: userData, isLoading: false });
      saveUserToLocalStorage(userData);
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Ошибка входа',
        isLoading: false,
      });
    }
  },

  // Выход пользователя
  logout: () => {
    set({ user: null });
    removeUserFromLocalStorage();
  },
}));

export default AuthStore;
