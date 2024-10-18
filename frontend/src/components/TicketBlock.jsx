import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketStore from "../data/TicketStore";
import AuthStore from "../data/AuthStore";

const statusTranslations = {
    open: "Открыта",
    in_progress: "В работе",
    closed: "Закрыта"
};

export default function TicketBlock({ id, title, description, status, category }) {
    const { user, role } = AuthStore();
    const { updateTicketStatus } = TicketStore(); // Метод для обновления тикета
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    // Обработчик клика по тикету
    const handleTicketClick = () => {
        if (role === "support" && status === "open") {
            // Показываем предупреждение для роли "support"
            setShowConfirm(true);
        } else {
            // Просто переходим к детальной странице тикета
            navigate(`/tickets/${id}`);
        }
    };

    // Обработчик подтверждения принятия тикета
    const handleAcceptTicket = async () => {
        try {
            // Обновляем статус тикета и закрепляем его за текущим пользователем
            await updateTicketStatus(id, {
                status: "in_progress",
                assigned_to: user.user_id,
            });

            // Переходим на детальную страницу тикета после принятия
            navigate(`/tickets/${id}`);
        } catch (error) {
            console.error("Ошибка при принятии тикета:", error);
        }
    };

    return (
        <>
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

            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <p className="text-gray-800 mb-4">
                            Принять тикет и перевести его в статус "в работе"?
                        </p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAcceptTicket}
                            >
                                Да
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowConfirm(false)}
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
