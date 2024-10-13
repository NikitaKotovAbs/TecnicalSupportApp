import create from 'zustand';

// Хранилище для работы с категориями тикетов
const TicketCategoryStore = create((set) => ({
    categories: [],

    addCategory: (category) => set((state) => ({categories: [...state.categories, category]})),

    removeCategory: (categoryId) => set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== categoryId),
    })),

    setCategories: (categories) => set(() => ({categories})),
}));

