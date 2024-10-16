import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

const UserStore = create((set) => ({
    users: {},
    fetchUsers: async () => {
         console.log("Загрузка пользователей начата");
    try {
        const response = await axios.get(`${API_URL}/api/user/`); // Замените на ваш API для пользователей
        const usersData = response.data.results; // Доступ к массиву пользователей через results

        // Проверка на случай, если results не является массивом
        if (!Array.isArray(usersData)) {
            console.error("Данные пользователей не являются массивом:", usersData);
            return; // Возврат, если данные некорректны
        }

        const usersMap = {};
        usersData.forEach(user => {
            usersMap[user.id] = user.username; // Создаем объект с id в качестве ключа и именем в качестве значения
        });
        console.log("Загруженные пользователи:", usersMap); // Для отладки
        set({ users: usersMap });
    } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
    }
    console.log("Загрузка пользователей завершена");

},
}));

export default UserStore;
