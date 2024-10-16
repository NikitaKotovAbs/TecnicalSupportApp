import {create} from "zustand";
import axios from "axios";
import AuthStore from './AuthStore.js';

// Получаем токен из AuthStore
const {token} = AuthStore.getState();
const API_URL = import.meta.env.VITE_API_URL
import UserStore from "./UserStore.js";

const CommentStore = create((set) => ({
    comments: [],
    isLoading: false,


    // Метод для получения комментариев с фильтрацией по тикету и автору
    fetchComments: async (ticketId) => {
        set({isLoading: true});
        try {
            // Убедитесь, что пользователи загружены
            let users = UserStore.getState().users;
            if (Object.keys(users).length === 0) {
                console.log("Пользователи не загружены, загружаем...");
                await UserStore.getState().fetchUsers(); // Загружаем пользователей, если они не загружены
                // После загрузки снова получаем пользователей
                users = UserStore.getState().users;
            }

            const response = await axios.get(`${API_URL}/api/comments/`);
            const allComments = response.data.results;
            console.log("Массив комментариев:", allComments);

            const filteredComments = allComments.filter(comment => {
                console.log(`Сравниваем ticketId: ${ticketId} с comment.ticket: ${comment.ticket}`);
                return comment.ticket === Number(ticketId);
            });

            console.log("Данные пользователей перед фильтрацией:", users);

            const commentsWithAuthors = filteredComments.map(comment => {
                const authorName = users[comment.author];
                console.log("ИДЕНТИФИКАТОР ПОЛЬЗОВАТЕЛЯ:", authorName)
                return {
                    ...comment,
                    authorName: authorName ? authorName : "Неизвестный автор",
                };
            });

            console.log("Filtered comments:", commentsWithAuthors);
            set({comments: commentsWithAuthors});

        } catch (error) {
            console.error("Ошибка загрузки комментариев:", error);
        } finally {
            set({isLoading: false});
        }
    },


    // Метод для добавления комментария
    addComment: async (ticketId, commentContent) => {
        try {
            const {token} = AuthStore.getState();
            if (!token) {
                throw new Error("Пользователь не авторизован");
            }

            const response = await axios.post(`${API_URL}/api/comments/`, {
                ticket: ticketId,
                content: commentContent,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log("Данный комментарий", response.data);
            set((state) => ({comments: [...state.comments, response.data]}));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("Токен истек. Пожалуйста, выполните вход заново.");
                // Здесь можно добавить логику для повторного запроса токена или перенаправления на страницу входа
            } else {
                console.error("Ошибка при добавлении комментария:", error);
            }
        }
    },


    setComments: (comments) => set(() => ({comments})),
}));

export default CommentStore;
