// Хранилище для работы с тикетами
import {create} from "zustand";

/** @typedef {import('../types').Ticket} Ticket */

const TicketStore = create((set) => ({
    /** @type {Ticket[]} */
    tickets: [],
    // Функция добавления в массив
    addTicket: (ticket) => set((state) => ({tickets: [...state.tickets, ticket]})),

     // Функция изменения данных масива
    updateTicket: (updatedTicket) => set((state) => ({
        tickets: state.tickets.map((ticket) =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket
        ),
    })),

     // Функция удаления данных в массиве
    removeTicket: (ticketId) => set((state) => ({
        tickets: state.tickets.filter((ticket) => ticket.id !== ticketId),
    })),

     // Функция заполнения массива
    setTickets: (tickets) => set(() => ({tickets})),
}));

export default TicketStore