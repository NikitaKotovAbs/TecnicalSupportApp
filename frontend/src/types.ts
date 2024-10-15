
export interface User {
  id: number;
  username: string;
}

// Тип для модели TicketCategory
export interface TicketCategory {
    id: number;  // Django обычно добавляет поле id по умолчанию
    name: string;
}

// Тип для модели Ticket
export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';  // Статусы на основе STATUS_CHOICES
    priority: 'low' | 'medium' | 'high' | 'urgent';  // Приоритет на основе PRIORITY_CHOICES
    created_at: string;  // Дата в формате строки, обычно ISO формат (2024-09-15T13:45:30Z)
    updated_at: string;
    assigned_to: User | null;  // Может быть null, если тикет не назначен никому
    created_by: User;
    category: TicketCategory | null;  // Может быть null, если категория не указана
}

// Тип для модели User (в данном случае, использую упрощённую версию)
export interface User {
    id: number;
    username: string;
    email: string;
    // Добавьте другие поля, если нужно
}

// Тип для модели Comment
export interface Comment {
    id: number;
    ticket: Ticket;  // Комментарий привязан к тикету
    author: User;  // Автор комментария
    content: string;  // Текст комментария
    created_at: string;  // Дата создания комментария
}

// Тип для модели TicketHistory
export interface TicketHistory {
    id: number;
    ticket: Ticket;  // Связь с тикетом
    changed_by: User;  // Кто изменил тикет
    change_type: string;  // Описание изменения
    changed_at: string;  // Дата изменения
}
