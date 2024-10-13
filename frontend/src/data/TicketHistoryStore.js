// Хранилище для работы с историей изменений тикетов
import create from "zustand";

const TicketHistoryStore = create((set) => ({
    history: [],

    addHistoryEntry: (entry) => set((state) => ({history: [...state.history, entry]})),

    setHistory: (history) => set(() => ({history})),
}));