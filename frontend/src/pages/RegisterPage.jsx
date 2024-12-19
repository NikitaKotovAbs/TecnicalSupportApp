import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from "react-router-dom";
import AuthStore from '../data/AuthStore.js';
import verifyEmailStore from '../data/verifyEmailStore.js';
import VerificationCodeInput from '../components/VerificationCodeInput.jsx'; // Импортируем компонент

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser, isLoading, error } = AuthStore();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showNoSuccessModal, setShowNoSuccessModal] = useState(false); // Исправлено
    const [userId, setUserId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const onSubmit = async (data) => {
        const result = await registerUser(data.username, data.password, data.email);
        console.log("Никнейм, пароль, почта", result);

        if (result && !error) {
            setUserId(result.id);
            setShowVerificationModal(true);
        }
    };

    const onVerifyEmail = async () => {
        const result = await verifyEmailStore(userId, verificationCode);
        setShowVerificationModal(false);
        console.log("Результат:", result.success);
        console.log("Ошибка", result.error);
        if (result.success) {
            setShowSuccessModal(true);
        } else {
            setShowNoSuccessModal(true); // Используем setShowNoSuccessModal
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Регистрация</h2>
                {error && <div className="text-red-500 text-center mb-4">Ошибка: {error}</div>}

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="username">Логин</label>
                    <input
                        type="text"
                        id="username"
                        {...register('username', {
                            required: 'Введите логин',
                            minLength: { value: 3, message: 'Логин должен быть минимум 3 символа' }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register('email', {
                            required: 'Введите email',
                            pattern: { value: /\S+@\S+\.\S+/, message: 'Неверный формат email' }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2" htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        {...register('password', {
                            required: 'Введите пароль',
                            minLength: { value: 6, message: 'Пароль должен быть минимум 6 символов' }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <button type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>

                <div className="text-center mt-4">
                    <p className="text-gray-600">Уже есть аккаунт? <Link to="/auth"
                        className="text-blue-500 hover:underline">Авторизоваться</Link>
                    </p>
                </div>
            </form>

            {showVerificationModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-center">Введите код подтверждения</h3>
                        <div className="flex justify-center">
                            <VerificationCodeInput
                                length={6}
                                onChange={(code) => setVerificationCode(code)}
                            />
                        </div>
                        <button
                            onClick={onVerifyEmail}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition duration-200 mt-4"
                        >
                            Подтвердить
                        </button>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-center">Регистрация завершена</h3>
                        <p className="text-gray-600 text-center mb-6">Теперь вы можете авторизоваться.</p>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                setShowVerificationModal(false);
                                navigate('/auth');
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition duration-200"
                        >
                            ОК
                        </button>
                    </div>
                </div>
            )}

            {showNoSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-center">Регистрация не завершена</h3>
                        <p className="text-gray-600 text-center mb-6">Неверный код подтверждения, введите повторно</p>
                        <button
                            onClick={() => {
                                setShowNoSuccessModal(false); // Используем setShowNoSuccessModal
                                setShowVerificationModal(true);
                            }}
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
