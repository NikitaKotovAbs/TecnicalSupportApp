import TicketBlock from "../components/TicketBlock.jsx";
import TicketStore from "../data/TicketStore.js";
import {useEffect, useState} from "react";
import AuthStore from "../data/AuthStore.js";
import Loader from "../components/Loader.jsx";
import {useNavigate} from "react-router-dom";
import CreateTicketForm from "../components/CreateTicketForm.jsx";

export default function TicketsPage({}) {
    const {tickets, loadTicketsWithCategories, isLoading, page, totalPages, updateTicketStatus} = TicketStore();
    const {user, role} = AuthStore();
    const navigate = useNavigate();

    // Фильтры
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Применяем фильтры к тикетам
    const filteredTickets = tickets.filter(ticket => {
        // Для роли "user" — фильтруем только тикеты, созданные текущим пользователем
        const isUserTicket = role === "user" ? ticket.created_by === user?.user_id : true;
        const statusMatch = statusFilter === "all" || ticket.status === statusFilter;
        const categoryMatch = categoryFilter === "all" || ticket.categoryName === categoryFilter;
        return isUserTicket && statusMatch && categoryMatch;
    });

    const handlePageChange = (newPage) => {
        const {totalPages} = TicketStore.getState(); // Получаем общее количество страниц

        // Не позволяем переходить на страницы за пределами диапазона
        if (newPage > 0 && newPage <= totalPages) {
            TicketStore.getState().setPage(newPage);
            TicketStore.getState().loadTicketsWithCategories(newPage);
        }
    };

    useEffect(() => {
        loadTicketsWithCategories(page);
    }, [page]);

    return (
        <div className="container mx-auto mt-28 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">
                {role === "support" ? "Все Тикеты" : "Мои Тикеты"}
            </h1>

            {/* Фильтры */}
            <div className="flex justify-between mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="all">Все статусы</option>
                    <option value="open">Открытые</option>
                    <option value="in_progress">В работе</option>
                    <option value="closed">Закрытые</option>
                </select>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="all">Все категории</option>
                    <option value="Технические ошибки">Технические ошибки</option>
                    <option value="Установка и настройка">Установка и настройка</option>
                </select>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        {role === "support" ? "Тикеты пользователей" : "Ваши Тикеты"}
                    </h2>
                    <div className="flex flex-col items-center gap-y-5">
                        {!user ? (
                            <div className="text-center mt-20">
                                <p>Вы не авторизированы</p>
                                <button
                                    onClick={() => navigate('/auth', {state: {from: '/tickets'}})}
                                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    Авторизоваться
                                </button>
                            </div>
                        ) : isLoading ? (
                            <Loader />
                        ) : filteredTickets.length > 0 ? (
                            filteredTickets.map(ticket => (
                                <TicketBlock
                                    key={ticket.id}
                                    id={ticket.id}  // Передаем ID тикета
                                    title={ticket.title}
                                    description={ticket.description}
                                    status={ticket.status}
                                    category={ticket.categoryName}
                                    className="mx-auto"
                                />
                            ))
                        ) : (
                            <p className="mt-20 text-center">
                                {role === "support" ? "Нет тикетов пользователей." : "У вас нет тикетов."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Блок с формой создания тикета для пользователя */}
                {role === "user" && (
                    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
                        <CreateTicketForm />
                    </div>
                )}
            </div>
        </div>
    );
}
