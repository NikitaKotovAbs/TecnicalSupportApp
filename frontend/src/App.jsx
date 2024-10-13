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
//Todo import NotFoundPage from './NotFoundPage';  // Импорт страницы с ошибкой 404


export default function App() {

    return (
        <Router>
            <div className="App">
                <Layout>
                    <Routes>
                        <Route index element={<MainPage/>}/>
                        {/*<Route path="/Test" element={<Test/>}/>*/}
                        {/*<Route path="*" element={<ErrorMessage/>}/> /!* Маршрут для ненайденных страниц *!/*/}
                    </Routes>
                </Layout>
            </div>
        </Router>
    )
}