import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import TicketStore from "../data/TicketStore";
import CommentStore from "../data/CommentStore";
import Loader from "../components/Loader";

export default function TicketDetailPage({currentUserId}) { // Добавляем пропс для текущего пользователя
    const {ticketId} = useParams();
    const {ticket, loadTicketById, loadCategories, isLoading, categories} = TicketStore();
    const {comments, fetchComments, addComment, isLoading: isCommentsLoading} = CommentStore();
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null); // Состояние для обработки ошибок

    useEffect(() => {
        if (!currentUserId) {
            console.error("ID текущего пользователя не задан");
        }

        const fetchData = async () => {
            await loadCategories();
            if (ticketId) {
                await loadTicketById(ticketId);
                await fetchComments(ticketId, currentUserId); // Передаем ID текущего пользователя
            }
        };

        fetchData();
    }, [ticketId, loadTicketById, loadCategories, fetchComments, currentUserId, ticketId]);

    const handleAddComment = async () => {
        console.log("Текущий пользователь:", currentUserId); // Логирование текущего пользователя

        if (newComment.trim()) {
            try {
                await addComment(ticketId, newComment, currentUserId);
                console.log("Номер тикета", ticketId);
                console.log("Текст комментария", newComment);
                console.log("Автор", currentUserId); // Убедитесь, что currentUserId не undefined
                setNewComment("");
                setError(null);
            } catch (error) {
                setError("Ошибка при добавлении комментария. Пожалуйста, попробуйте снова.");
            }
        } else {
            setError("Комментарий не может быть пустым.");
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
            {/* Ticket Header */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Тикет: {ticket.title}</h1>
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
            </div>

            {/* Ticket Description */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Описание тикета</h2>
                <p className="text-gray-600 leading-relaxed">
                    {ticket.description}
                </p>
            </div>

            {/* Comments Section */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 animate-slide-in-bottom mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Комментарии</h2>

                {/* Messages */}
                <div className="mb-4 space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex">
                            <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-lg max-w-md">
                                <p className="font-semibold">Отправитель {comment.authorName}:</p> {/* Можно заменить на имя пользователя */}
                                <p>{comment.content}</p>
                                <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString("ru-RU")}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input for new comment */}
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Напишите комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 animate-pulse">
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
}
