import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");
  const [logs, setLogs] = useState([]);

  const handleBackupClick = async () => {
    setIsBackupInProgress(true);
    setBackupMessage("");

    try {
      const response = await fetch('http://127.0.0.1:8000/backup-database/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.status === "success") {
        setBackupMessage("Бэкап выполнен успешно!");
      } else {
        setBackupMessage("Ошибка при выполнении бэкапа.");
      }
    } catch (error) {
      console.error("Ошибка при подключении к серверу:", error);
      setBackupMessage("Произошла ошибка при подключении к серверу.");
    } finally {
      setIsBackupInProgress(false);
    }
  };

  // Функция для получения логов с сервера
  const fetchLogs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/get-logs/');
      const result = await response.json();
      if (result.status === "success") {
        setLogs(result.logs);
      } else {
        console.error("Ошибка получения логов:", result.message);
      }
    } catch (error) {
      console.error("Ошибка при подключении к серверу:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <div className="relative flex justify-center items-center h-96 mt-24 bg-cover bg-center animate-fadeBackground z-0">
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <h1 className="relative text-white text-4xl font-bold text-center max-w-xl mx-auto">
          Наша поддержка работает <span className="text-yellow-400">24/7</span>
        </h1>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleBackupClick}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          disabled={isBackupInProgress}
        >
          {isBackupInProgress ? 'Выполняется бэкап...' : 'Создать бэкап базы данных'}
        </button>
        {backupMessage && (
          <p className="mt-4 text-lg font-semibold">{backupMessage}</p>
        )}
      </div>

      {/* Логи */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Логи запросов</h2>
        <div className="mt-4">
          {logs.length > 0 ? (
            <ul>
              {logs.map((log, index) => (
                <li key={index} className="border-b py-2">{log}</li>
              ))}
            </ul>
          ) : (
            <p>Нет доступных логов.</p>
          )}
        </div>
      </div>
    </div>
  );
}
