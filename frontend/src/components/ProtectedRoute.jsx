import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthStore from '../data/AuthStore.js'; // Подключите ваш AuthStore

const ProtectedRoute = ({ element }) => {
  const { token } = AuthStore(state => state); // Получаем токен из хранилища

  return token ? element : <Navigate to="/auth" />; // Если токен есть, возвращаем элемент, иначе перенаправляем на /auth
};

export default ProtectedRoute;
