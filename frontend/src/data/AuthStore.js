import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Функция для загрузки пользователя из localStorage
const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log("Данные пользователя LoadUserFromLocalStorage", userData);
        return {
            user: userData,
            token: userData.access,
            tokenRefresh: userData.refresh,
            userId: userData.user_id,
            role: userData.groups
        };  // Возвращаем объект с пользователем и токеном
    }
    return null;
};

// Функция для сохранения пользователя в localStorage
const saveUserToLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Функция для удаления пользователя из localStorage
const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
};

const AuthStore = create((set) => {
    const refreshAccessToken = async () => {
        console.log("Я зашёл в рефреш токен");
        const storedUser = loadUserFromLocalStorage();
        if (!storedUser) return;

        try {
            const response = await axios.post(`${API_URL}/api/token/refresh/`, {
                refresh: storedUser.tokenRefresh,
            });

            // Обновляем все данные пользователя
            const updatedUserData = {
                ...storedUser.user, // Включаем все данные пользователя
                access: response.data.access, // Обновляем access токен
            };

            set({
                token: response.data.access,
                user: updatedUserData,
                tokenRefresh: storedUser.tokenRefresh, // Оставляем refresh токен прежним
                userId: storedUser.userId, // Сохраняем userId
                role: storedUser.role // Сохраняем роль
            });

            saveUserToLocalStorage({
                ...updatedUserData,
                access: response.data.access, // Сохраняем новый access токен
                refresh: storedUser.tokenRefresh, // Сохраняем refresh токен
                user_id: storedUser.userId, // Сохраняем userId
                groups: storedUser.role // Сохраняем роль
            });

            console.log("Токен обновлён:", response.data.access);
        } catch (error) {
            console.error("Ошибка обновления токена:", error.response?.data?.message || 'Не удалось обновить токен');

            if (error.response?.status === 401) {
                console.log("Выход из системы из-за невалидного токена");
                logout();
            }
        }
    };

    // Устанавливаем интервал для обновления токена каждые 5 минут
    const refreshInterval = setInterval(refreshAccessToken, 5 * 60 * 1000);

    return {
        user: loadUserFromLocalStorage()?.user || console.log("Пользователь не был загружен"),
        isLoading: false,
        error: null,
        token: loadUserFromLocalStorage()?.token || console.log("Токен не был загружен"),
        tokenRefresh: loadUserFromLocalStorage()?.tokenRefresh || console.log("Рефреш Токен не был загружен"),
        userId: loadUserFromLocalStorage()?.userId || console.log("Id пользователя не был загружен"),
        role: loadUserFromLocalStorage()?.role || console.log("Роль не была загружена"),

        // Регистрация пользователя
        register: async (username, password, email) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.post(`${API_URL}/api/register/`, { username, password, email });
                const userData = response.data;
                console.log("Response:", response)
                console.log("UserDATA:", userData)
                set({ isLoading: false });
                return userData;
            } catch (error) {
                set({
                    error: error.response?.data?.message || 'Ошибка регистрации',
                    isLoading: false,
                });
                return false; // Ошибка регистрации
            }
        },

        // Вход пользователя
        login: async (username, password) => {
            set({ isLoading: true, error: null });

            try {
                const response = await axios.post(`${API_URL}/api/login/`, { username, password });
                const userData = response.data;

                // Сохраняем пользователя в состояние и localStorage
                set({
                    user: userData,
                    isLoading: false,
                    token: userData.access,
                    tokenRefresh: userData.refresh,
                    userId: userData.user_id,
                    role: userData.groups
                });
                saveUserToLocalStorage(userData);
                console.log("Данные пользователя:", userData);
            } catch (error) {
                set({
                    error: error.response?.data?.message || 'Ошибка входа',
                    isLoading: false,
                });
            }
        },

        // Выход пользователя
        logout: () => {
            set({ user: null, token: null });
            removeUserFromLocalStorage();
            clearInterval(refreshInterval); // Очищаем интервал при выходе
        },
        refreshAccessToken,
    };
});

export default AuthStore;