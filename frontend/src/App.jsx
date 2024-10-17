import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";
import TicketDetailPage from "./pages/TicketDetailPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "tailwindcss/tailwind.css";
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route index element={<MainPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/tickets" element={<ProtectedRoute element={<TicketsPage />} />} />
            <Route path="/tickets/:ticketId" element={<ProtectedRoute element={<TicketDetailPage />} />} />
            {/* <Route path="*" element={<ErrorMessage />} /> // Маршрут для ненайденных страниц */}
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}
