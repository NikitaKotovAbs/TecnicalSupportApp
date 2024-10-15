import TicketBlock from "../components/TicketBlock.jsx";
import TicketStore from "../data/TicketStore.js";
import { useEffect } from "react";
import AuthStore from "../data/AuthStore.js";
import Loader from "../components/Loader.jsx";
import { useNavigate } from "react-router-dom";
import CreateTicketForm from "../components/CreateTicketForm.jsx"; // Импортируем форму создания тикетов

export default function TicketsPage() {
    const { tickets, loadTicketsWithCategories, isLoading } = TicketStore();
    const { user } = AuthStore();
    const navigate = useNavigate();

    // Фильтруем тикеты только по текущему пользователю
    const userTickets = tickets.filter(ticket => ticket.created_by === user?.user_id);

    useEffect(() => {
        loadTicketsWithCategories();
    }, []);

    return (
        <div className="container mx-auto mt-28 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Мои Тикеты</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Блок с тикетами */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Ваши Тикеты</h2>
                    <div className="flex flex-col gap-y-5">
                        {!user ? (
                            <div className="text-center mt-20">
                                <p>Вы не авторизированы</p>
                                <button
                                    onClick={() => navigate('/auth', { state: { from: '/tickets' } })}
                                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    Авторизоваться
                                </button>
                            </div>
                        ) : isLoading ? (
                            <Loader />
                        ) : userTickets.length > 0 ? (
                            userTickets.map(ticket => (
                                <TicketBlock
                                    key={ticket.id}
                                    title={ticket.title}
                                    description={ticket.description}
                                    status={ticket.status}
                                    category={ticket.categoryName}
                                />
                            ))
                        ) : (
                            <p className="mt-20 text-center">У вас нет тикетов.</p>
                        )}
                    </div>
                </div>

                {/* Блок с формой создания тикета */}
                {user ? (
                <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
                    <CreateTicketForm />
                </div>
                    ): null}
            </div>
        </div>
    );
}
