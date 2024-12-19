import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'; // Импорт иконок
import logo from "../assets/logo.png";
import AuthStore from '../data/AuthStore.js';

export default function Layout({children}) {
    const navigate = useNavigate();
    const {user, role, logout} = AuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Верхняя панель */}
            <header className="bg-white shadow-md fixed w-full z-10">
                <div className="container mx-auto px-10 py-1 flex items-center justify-between">
                    {/* Логотип */}
                    <Link to="/">
                        <img className="w-20 h-auto cursor-pointer" src={logo} alt="logo"/>
                    </Link>

                    {/* Надпись Caty Support */}
                    <div className="text-xl font-semibold text-gray-800 mx-4">
                        Caty Support
                    </div>

                    {/* Навигация */}
                    <nav className="hidden md:flex space-x-8 items-center text-gray-800">
                        <Link to='/home' className="hover:text-blue-500 transition-colors duration-300">О нас</Link>
                        <Link to='/Test' className="hover:text-blue-500 transition-colors duration-300">Команда</Link>
                        <Link to='/' className="hover:text-blue-500 transition-colors duration-300">FAQ</Link>
                        {
                            role === "admin" ? (
                                <button
                                    onClick={() => navigate('/admin-dashboard')}
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Админ панель
                                </button>
                            ) : role === "support" ? (
                                <button
                                    onClick={() => navigate('/tickets')}
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Все тикеты
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/tickets')}
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Задать вопрос
                                </button>
                            )
                        }


                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <p className="text-gray-800">{user.username}</p>
                                    <button
                                        onClick={() => {
                                            logout(); // Вызываем функцию logout
                                            navigate('/'); // Затем переходим на страницу тикетов
                                        }}
                                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
                                    >
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to='/register'
                                          className="hover:text-blue-500 transition-colors duration-300">Регистрация</Link>
                                    <Link to='/auth'
                                          className="hover:text-blue-500 transition-colors duration-300">Авторизация</Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Мобильная навигация */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu}
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                            <Bars3Icon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>

                {/* Бургер-меню с анимацией */}
                <div
                    className={`fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-transform duration-300 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                    <div className="flex flex-col items-center py-4">
                        <button onClick={toggleMenu}
                                className="text-black font-bold py-2 px-4 rounded-lg mb-4 flex items-center">
                            <XMarkIcon className="w-6 h-6"/>
                        </button>
                        <Link to='/home' className="hover:text-blue-500 transition-colors duration-300 py-2">О
                            нас</Link>
                        <Link to='/Test'
                              className="hover:text-blue-500 transition-colors duration-300 py-2">Команда</Link>
                        <Link to='/' className="hover:text-blue-500 transition-colors duration-300 py-2">FAQ</Link>
                        <button
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                            Задать вопрос
                        </button>
                        {user ? (
                            <>
                                <p className="text-gray-800 py-2">{user.username}</p>
                                <button
                                    onClick={logout}
                                    className="text-red-500 font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to='/register'
                                      className="hover:text-blue-500 transition-colors duration-300 py-2">Регистрация</Link>
                                <Link to='/auth'
                                      className="hover:text-blue-500 transition-colors duration-300 py-2">Авторизация</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Контент */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>

        </>
    );
}
