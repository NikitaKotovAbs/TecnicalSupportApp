import TicketBlock from "../components/TicketBlock.jsx";
import TicketStore from "../data/TicketStore.js";
import { useEffect } from "react";

export default function TicketsPage() {
    const { tickets, loadTicketsWithCategories } = TicketStore();

    // Загружаем тикеты с категориями при монтировании компонента
    useEffect(() => {
        loadTicketsWithCategories();
    }, [loadTicketsWithCategories]);

    return (
        <div className="container mx-auto mt-28 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Мои Тикеты</h1>

            {/* Flex-контейнер для тикетов */}
            <div className="flex justify-evenly flex-wrap gap-y-5">
                {tickets.map(ticket => (
                    <TicketBlock
                        key={ticket.id} // Изменил на ticket.id, так как он должен быть уникальным
                        title={ticket.title}
                        description={ticket.description}
                        status={ticket.status}
                        category={ticket.category} // Используем categoryName для отображения имени категории
                    />
                ))}
            </div>
        </div>
    );
}
