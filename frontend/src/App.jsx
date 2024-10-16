import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./pages/Home.jsx";
import "tailwindcss/tailwind.css"
import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";
import TicketDetailPage from "./pages/TicketDetailPage.jsx";
//Todo import NotFoundPage from './NotFoundPage';  // Импорт страницы с ошибкой 404


export default function App() {

    return (
        <Router>
            <div className="App">
                <Layout>
                    <Routes>
                        <Route index element={<MainPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/auth" element={<AuthPage/>}/>
                        <Route path="/tickets" element={<TicketsPage/>}/>
                        <Route path="/tickets/:ticketId" element={<TicketDetailPage/>}/>
                        {/*<Route path="*" element={<ErrorMessage/>}/> /!* Маршрут для ненайденных страниц *!/*/}
                    </Routes>
                </Layout>
            </div>
        </Router>
    )
}