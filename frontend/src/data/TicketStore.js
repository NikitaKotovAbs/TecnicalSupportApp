import {create} from "zustand";
import axios from "axios";
import AuthStore from "./AuthStore.js";
import {useState} from "react";

// URL для API
const API_URL = import.meta.env.VITE_API_URL;

/** @typedef {import('../types').Ticket} Ticket */

// Хранилище для работы с тикетами
const TicketStore = create((set, get) => ({
    tickets: [],
    categories: [],
    ticket: null,
    isLoading: false,
    error: null,
    priority: Object.entries({
        "low": "Низкий",
        "medium": "Средний",
        "high": "Высокий",
        "urgent": "Срочный",
    }),
    created_by: Number(),
    page: 1,
    totalPages: 1, // Добавляем общее количество страниц

    // Функция добавления тикета
    addTicket: (ticket) => set((state) => ({tickets: [...state.tickets, ticket]})),

    // Функция для создания нового тикета
    createTicket: async (ticketData) => {
        try {
            set({isLoading: true, error: null});
            const response = await axios.post(`${API_URL}/api/tickets/`, ticketData);
            const newTicket = response.data;

            // Добавляем новый тикет в хранилище
            set((state) => ({
                tickets: [...state.tickets, newTicket],
                isLoading: false,
            }));
        } catch (error) {
            console.error("Ошибка при создании тикета: ", error.response.data);
        }
    },

    // Функция обновления тикета
    updateTicket: (updatedTicket) => set((state) => ({
        tickets: state.tickets.map((ticket) =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket
        ),
    })),

    // Функция удаления тикета
    removeTicket: (ticketId) => set((state) => ({
        tickets: state.tickets.filter((ticket) => ticket.id !== ticketId),
    })),

    // Функция установки тикетов
    setTickets: (tickets) => set(() => ({tickets})),

    // Функция загрузки категорий
    loadCategories: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/categories/`);
            const categories = response.data.results;
            // setPagination({next: categories.next, previous: categories.previous})
            set({categories}); // Сохранение категорий в состояние
        } catch (error) {
            console.error("Ошибка при загрузке категорий: ", error.message);
        }
    },


    // Метод для обновления статуса тикета
    updateTicketStatus: async (ticketId, data) => {
        const {token} = AuthStore.getState();
        try {
            const response = await axios.patch(
                `${API_URL}/api/tickets/${ticketId}/`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Ошибка обновления тикета:", error);
        }
    },

// Функция загрузки тикетов и категорий с API
    loadTicketsWithCategories: async (page) => {
        try {
            set({isLoading: true, error: null});

            const currentPage = page || get().page; // Используем get() для получения текущей страницы
            const createdBy = get().created_by; // Получаем id пользователя

            // Запрашиваем тикеты с сервера
            const ticketsResponse = await axios.get(`${API_URL}/api/tickets/?page=${currentPage}&created_by=${createdBy}`);
            const {results: tickets, count} = ticketsResponse.data;

            // Вычисляем количество страниц
            const totalPages = Math.ceil(count / 5); // Если у вас по 5 тикетов на странице

            // Если текущая страница больше доступных страниц, откатимся на последнюю доступную страницу
            if (currentPage > totalPages) {
                set({page: totalPages, isLoading: false});
                return;
            }

            // Загружаем категории
            const categoriesResponse = await axios.get(`${API_URL}/api/categories/`);
            const categories = categoriesResponse.data.results || [];

            const categoryMap = categories.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {});

            const ticketsWithCategories = tickets.map((ticket) => ({
                ...ticket,
                categoryName: categoryMap[ticket.category] || "Неизвестная категория",
            }));

            // Обновляем тикеты, общее количество страниц и текущее состояние загрузки
            set({tickets: ticketsWithCategories, totalPages, isLoading: false});
        } catch (error) {
            console.error("Ошибка при загрузке тикетов или категорий: ", error.message);
            set({isLoading: false});
        }
    },



    // Функция для загрузки тикета по ID
    loadTicketById: async (ticketId) => {
        try {
            set({isLoading: true, error: null});
            const response = await axios.get(`${API_URL}/api/tickets/${ticketId}`);
            const ticket = response.data;
            console.log(ticket);

            // Получаем категории из состояния
            const categories = get().categories; // Загружаем категории из состояния

            // Создаем отображение категорий
            const categoryMap = categories.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {});

            console.log(categoryMap)

            // Получаем название категории
            ticket.categoryName = categoryMap[ticket.category] || "Неизвестная категория";

            // Устанавливаем тикет в состояние
            set({ticket, isLoading: false});
        } catch (error) {
            console.error("Ошибка при загрузке тикета: ", error.message);
            set({isLoading: false});
        }
    },


    setPage: (newPage) => set(() => ({page: newPage})),
}));

export default TicketStore;
