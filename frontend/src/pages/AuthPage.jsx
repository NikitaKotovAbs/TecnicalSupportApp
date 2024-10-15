import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import AuthStore from '../data/AuthStore.js';
import {useNavigate, useLocation} from "react-router-dom";

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Получаем объект location
    const {register, handleSubmit, formState: {errors}} = useForm();
    const {login, isLoading, error, user} = AuthStore();

    const from = location.state?.from || "/"; // Берем путь откуда пришел пользователь, если нет - на главную

    const onSubmit = async (data) => {
        await login(data.username, data.password);
    };

    useEffect(() => {
        if (user) {
            navigate(from); // Перенаправляем обратно, если авторизовался
        }
    }, [user, navigate, from]);

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Авторизация</h2>
                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error.includes("неправильный логин или пароль") ? 'Неправильный логин или пароль' : 'Ошибка авторизации'}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="username">
                        Логин
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Введите логин"
                        {...register('username', {
                            required: 'Введите логин',
                            minLength: {value: 3, message: 'Логин должен быть минимум 3 символа'}
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2" htmlFor="password">
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Введите пароль"
                        {...register('password', {
                            required: 'Введите пароль',
                            minLength: {value: 6, message: 'Пароль должен быть минимум 6 символов'}
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка...' : 'Войти'}
                </button>
            </form>
        </div>
    );
};

export default AuthPage;
