import {useForm} from 'react-hook-form';
import TicketStore from "../data/TicketStore.js";
import {useEffect, useState} from 'react';
import axios from 'axios';
import AuthStore from "../data/AuthStore.js"; // Добавьте этот импорт

export default function CreateTicketForm() {
    const {
        createTicket,
        loadTicketsWithCategories,
        loadCategories,
        categories,
        priority,
        created_by,
        tickets,
        isLoading,
        error
    } = TicketStore();
    const {register, handleSubmit, reset, formState: {errors}} = useForm();
    const [loading, setLoading] = useState(false);
    const { user } = AuthStore();
    // const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);

    // Загрузка категорий и приоритетов при монтировании компонента
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                await loadTicketsWithCategories(); // Загрузка тикетов с категориями
                await loadCategories(); // Загрузка категорий
                // Пример статичных приоритетов (можно заменить на данные из API)
                setPriorities(['Низкий', 'Средний', 'Высокий', 'Срочный']);
            } catch (error) {
                console.error("Ошибка при загрузке категорий и приоритетов:", error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Загрузка категорий и приоритетов при монтировании компонента
    // Загрузка категорий и приоритетов при монтировании компонента
    // useEffect(() => {
    //     async function fetchData() {
    //         setLoading(true);
    //         try {
    //             // Загрузка категорий через отдельный API-запрос
    //             const categoriesResponse = await axios.get(`${API_URL}/api/categories/`);
    //             setCategories(categoriesResponse.data.results);
    //
    //             // Пример статичных приоритетов (если нужно получать из API, замени этот блок)
    //             setPriorities(['Низкий', 'Средний', 'Высокий', 'Срочный']);
    //         } catch (error) {
    //             console.error("Ошибка при загрузке категорий и приоритетов:", error.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //
    //     fetchData();
    // }, []);
    // loadTicketsWithCategories, tickets

    // Обработчик отправки формы
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            data.created_by = user?.user_id
            await createTicket(data); // Создание тикета через TicketStore
            reset(); // Сброс формы после успешного создания тикета
        } catch (error) {
            console.error("Ошибка при создании тикета:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Создать новый тикет</h2>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Заголовок</label>
                <input
                    type="text"
                    {...register('title', {required: 'Заголовок обязателен'})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Описание</label>
                <textarea
                    {...register('description', {required: 'Описание обязательно'})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Категория</label>
                <select
                    {...register('category', {required: 'Выберите категорию'})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Выберите категорию</option>
                    {/* Здесь нужно отобразить категории */}
                    {categories.map((category, index) => (
                        <option key={index} value={category.id}>
                            {category.name} {/* Предполагается, что category имеет id и name */}
                        </option>
                    ))}
                </select>
                {errors.category && <p className="text-red-500">{errors.category.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Приоритет</label>
                <select
                    {...register('priority', {required: 'Выберите приоритет'})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Выберите приоритет</option>
                    {priority.map(([key, value], index) =>
                        <option key={index} value={key}>
                            {value}
                        </option>
                    )}


                </select>
                {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
                {loading ? 'Создание...' : 'Создать тикет'}
            </button>
        </form>
    );
}
