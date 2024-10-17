import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthStore from '../data/AuthStore.js';
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser, isLoading, error, user } = AuthStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSubmit = async (data) => {
    const result = await registerUser(data.username, data.password);

    if (result && !error) {
      setShowSuccessModal(true); // Показываем модальное окно
    }
  };

  // Закрытие модального окна и перенаправление на страницу авторизации
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/auth"); // Перенаправляем пользователя на страницу авторизации
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 animate-fade-in">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-slide-in-bottom">
        <h2 className="text-3xl font-bold mb-6 text-center">Регистрация</h2>
        {error && error.includes("повторяющееся значение ключа нарушает ограничение уникальности") && (
          <div className="text-red-500 text-center mb-4">Пользователь уже зарегистрирован</div>
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
              minLength: { value: 3, message: 'Логин должен быть минимум 3 символов' }
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
              minLength: { value: 6, message: 'Пароль должен быть минимум 6 символов' }
            })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 animate-pulse"
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>

        {/* Добавляем ссылку на авторизацию */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Уже есть аккаунт? <Link to="/auth" className="text-blue-500 hover:underline">Авторизоваться</Link>
          </p>
        </div>
      </form>

      {/* Модальное окно для успешной регистрации */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-scale-up">
            <h3 className="text-2xl font-bold mb-4 text-center">Регистрация завершена</h3>
            <p className="text-gray-600 text-center mb-6">
              Регистрация прошла успешно. Чтобы завершить процесс, пожалуйста, авторизуйтесь.
            </p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition duration-200"
            >
              ОК
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
