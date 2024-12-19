import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import TicketStore from "../data/TicketStore";
import CommentStore from "../data/CommentStore";
import Loader from "../components/Loader";
import AuthStore from "../data/AuthStore";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function TicketDetailPage() {
    const {user, role} = AuthStore.getState();
    const currentUserId = user ? user.id : null;
    const {ticketId} = useParams();
    const navigate = useNavigate();
    const [assignedUser, setAssignedUser] = useState(null);
    const {ticket, loadTicketById, loadCategories, isLoading, categories, updateTicketStatus} = TicketStore();
    const {comments, fetchComments, addComment, isLoading: isCommentsLoading} = CommentStore();
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false); // Для подтверждения закрытия

    useEffect(() => {
        const fetchData = async () => {
            await loadCategories();
            if (ticketId) {
                await loadTicketById(ticketId);  // Загружаем тикет только один раз
                await fetchComments(ticketId, currentUserId);
            }
        };

        fetchData();
    }, [ticketId, loadTicketById, loadCategories, fetchComments, currentUserId]);  // Убедись, что список зависимостей корректен

    useEffect(() => {
        if (ticket && ticket.assigned_to) {
            // Запросить информацию о пользователе, который принял тикет
            const fetchAssignedUser = async () => {
                try {
                    const API_URL = import.meta.env.VITE_API_URL;
                    const response = await axios.get(`${API_URL}/api/user/${ticket.assigned_to}`);
                    setAssignedUser(response.data); // Сохраняем информацию о пользователе
                } catch (error) {
                    console.error("Ошибка при загрузке пользователя:", error);
                }
            };

            fetchAssignedUser();
        }
    }, [ticket]);
    console.log("Тикет", ticket);  // Для отладки
    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                if (!currentUserId) {
                    Error("ID пользователя не определен");
                }

                await addComment(ticketId, newComment);
                setNewComment("");
                setError(null);
            } catch (error) {
                setError("Ошибка при добавлении комментария. Пожалуйста, попробуйте снова.");
            }
        } else {
            setError("Комментарий не может быть пустым.");
        }
    };

    const closeTicket = async () => {
        try {
            await updateTicketStatus(ticketId, {status: "closed"});
            setShowConfirm(false); // Скрываем предупреждение
            navigate(`/tickets`);

        } catch (error) {
            console.error("Ошибка при закрытии тикета:", error);
        }
    };

    if (isLoading || isCommentsLoading) {
        return <Loader/>;
    }

    if (!ticket) {
        return <p className="text-center mt-10">Тикет не найден</p>;
    }

    const categoryMap = categories.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
    }, {});

    const categoryName = categoryMap[ticket.category] || "Неизвестная категория";

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Тикет: {ticket.title}</h1>
                <p className="text-sm text-gray-500 mb-2">
                    Принял: <span>{assignedUser ? assignedUser.username : 'Не назначен'}</span> {/* Выводим никнейм */}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                    Статус: <span
                    className={`text-${ticket.status === 'open' ? 'green-500' : ticket.status === 'in_progress' ? 'yellow-500' : 'red-500'}`}>
                    {ticket.status === "open" ? "Открыт" :
                        ticket.status === "in_progress" ? "В работе" : "Закрыт"}
                    </span>
                </p>
                <p className="text-sm text-gray-500 mb-2">
                    Приоритет: <span
                    className={`text-${ticket.priority === 'urgent' ? 'red-500' : ticket.priority === 'high' ? 'yellow-500' : 'gray-500'}`}>
                    {ticket.priority === "urgent" ? "Срочный" :
                        ticket.priority === "high" ? "Высокий" :
                            ticket.priority === "medium" ? "Средний" : "Низкий"}
                    </span>
                </p>
                <p className={`text-sm text-gray-500 mb-2`}>Категория: <span
                    className="text-gray-600">{categoryName}</span></p>
                <p className="text-sm text-gray-500">Создан: {new Date(ticket.created_at).toLocaleDateString("ru-RU")}</p>

                {/* Кнопка закрытия тикета для пользователя поддержки */}

                {user && role === 'support' && ticket.status === 'in_progress' && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 focus:outline-none"

                        >
                            Закрыть тикет
                        </button>
                    </div>
                )}


            </div>

            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Описание тикета</h2>
                <p className="text-gray-600 leading-relaxed">
                    {ticket.description}
                </p>
            </div>

            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 animate-slide-in-bottom mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Комментарии</h2>
                <div className="mb-4 space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex">
                            <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-lg max-w-md">
                                <p className="font-semibold">Отправитель {comment.authorName}:</p>
                                <p>{comment.content}</p>
                                <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString("ru-RU")}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none ${
                            ticket.status === "closed" ? "bg-gray-200 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500"
                        }`}
                        placeholder={ticket.status === "closed" ? "Тикет закрыт, комментарии недоступны" : "Напишите комментарий..."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={ticket.status === "closed"} // Блокируем поле если тикет закрыт
                    />
                    <button
                        onClick={handleAddComment}
                        className={`px-4 py-2 rounded-lg shadow-lg animate-pulse ${
                            ticket.status === "closed" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        disabled={ticket.status === "closed"} // Блокируем кнопку если тикет закрыт
                    >
                        Отправить
                    </button>
                </div>
            </div>


            {/* Диалог подтверждения закрытия тикета */}
            {showConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-gray-800 mb-4">Вы точно хотите закрыть тикет?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeTicket}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 mr-2"
                            >
                                Да
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-400"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
