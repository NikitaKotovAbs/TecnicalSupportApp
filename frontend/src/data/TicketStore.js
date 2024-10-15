import {create} from "zustand";
import axios from "axios";

// URL для API
const API_URL = import.meta.env.VITE_API_URL;
/** @typedef {import('../types').Ticket} Ticket */

// Хранилище для работы с тикетами
const TicketStore = create((set) => ({
    /** @type {Ticket[]} */
    tickets: [],
    categories: [],
    isLoading: false,
    error: null,
    priority: Object.entries({
        "low": "Низкий",
        "medium": "Средний",
        "high": "Высокий",
        "urgent": "Срочный",
    }),
    created_by: 0,


    // Функция добавления тикета
    addTicket: (ticket) => set((state) => ({tickets: [...state.tickets, ticket]})),

    // Функция для создания нового тикета
    createTicket: async (ticketData) => {
        try {
            set({isLoading: true, error: null});

            // Заменяем 'Низкий' на 'low'
            // ticketData.priority = ticketData.priority === 'Низкий' ? 'low' : ticketData.priority;

            console.log(ticketData);
            const response = await axios.post(`${API_URL}/api/tickets/`, ticketData);
            const newTicket = response.data;
            console.log(newTicket);

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
            // console.log(categories)
            set({categories}); // Сохранение категорий в состояние
        } catch (error) {
            console.error("Ошибка при загрузке категорий: ", error.message);
        }
    },

    // Функция загрузки тикетов и категорий с API
    loadTicketsWithCategories: async () => {
        try {
            // Получаем тикеты
            set({isLoading: true, error: null});

            const ticketsResponse = await axios.get(`${API_URL}/api/tickets/`);
            const tickets = ticketsResponse.data.results;
            // Логируем тикеты для проверки
            // console.log("Тикеты:", tickets);

            // Получаем категории
            const categoriesResponse = await axios.get(`${API_URL}/api/categories/`);
            const categories = categoriesResponse.data.results || []; // Установить пустой массив по умолчанию

            // Логируем категории для проверки
            // console.log("Категории:", categories);

            // Создаем мап категорий по id для быстрого доступа
            const categoryMap = categories.reduce((acc, category) => {
                acc[category.id] = category.name; // Присваиваем имя категории по ID
                return acc;
            }, {});

            // Добавляем название категории к каждому тикету
            const ticketsWithCategories = tickets.map((ticket) => ({
                ...ticket,
                categoryName: categoryMap[ticket.category] || "Неизвестная категория", // Здесь получаем имя категории по ID
            }));

            // Обновляем состояние тикетов в хранилище
            set({tickets: ticketsWithCategories, isLoading: false});
        } catch (error) {
            console.error("Ошибка при загрузке тикетов или категорий: ", error.message);
        }
    }


}));

export default TicketStore;
