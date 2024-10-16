import React from 'react';
import { useNavigate } from 'react-router-dom';

const statusTranslations = {
    open: "Открыта",
    in_progress: "В работе",
    closed: "Закрыта"
};

export default function TicketBlock({ id, title, description, status, category }) {
    const navigate = useNavigate();

    const handleTicketClick = () => {
        // Переход на страницу деталей тикета с ID
        navigate(`/tickets/${id}`);
    };

    return (
        <div
            onClick={handleTicketClick}  // Добавляем обработчик клика для навигации
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 m-4 flex flex-col w-full max-w-md transition-transform transform hover:scale-105 cursor-pointer"
        >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex justify-between items-center">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    status === "open" ? "bg-green-200 text-green-800"
                        : status === "in_progress" ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                }`}>
                    {statusTranslations[status] || status}
                </span>
                <span className="text-gray-500 text-sm">{category}</span>
            </div>
        </div>
    );
}
