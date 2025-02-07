import { useState, useEffect } from "react";
import Cookies from 'js-cookie';  // Добавьте импорт библиотеки для работы с куки

export default function AdminDashboard() {
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [statusChartData, setStatusChartData] = useState(null);
  const [importFile, setImportFile] = useState(null);

  useEffect(() => {
    // Установка CSRF куки при загрузке страницы
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      fetch('http://127.0.0.1:8000/', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });
    }
  }, []);

  const handleBackupClick = async () => {
    setIsBackupInProgress(true);
    setBackupMessage("");

    try {
      const response = await fetch('http://127.0.0.1:8000/backup-database/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),  // Добавьте CSRF токен в заголовки
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

  const fetchChartData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/graph/');
      const result = await response.json();
      if (result.graph) {
        setChartData(result.graph);
      } else {
        console.error("Ошибка получения данных графика:", result.message);
      }
    } catch (error) {
      console.error("Ошибка при подключении к серверу:", error);
    }
  };

  const fetchStatusChartData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/ticket-status-graph/');
      const result = await response.json();
      if (result.graph) {
        setStatusChartData(result.graph);
      } else {
        console.error("Ошибка получения данных графика:", result.message);
      }
    } catch (error) {
      console.error("Ошибка при подключении к серверу:", error);
    }
  };

  const handleExportClick = () => {
    window.location.href = 'http://127.0.0.1:8000/export-tickets-csv/';
  };

  const handleImportClick = async () => {
    if (!importFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/import-tickets-csv/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Импорт выполнен успешно!");
      } else {
        alert("Ошибка при выполнении импорта.");
      }
    } catch (error) {
      console.error("Ошибка при подключении к серверу:", error);
      alert("Произошла ошибка при подключении к серверу.");
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchChartData();
    fetchStatusChartData();
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
        <div className="mt-4 h-64 overflow-y-auto border rounded-md p-4">
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

      <div className="mt-8">
        <h2 className="text-xl font-bold">График данных</h2>
        <div className="mt-4">
          {chartData ? (
            <img src={`data:image/png;base64,${chartData}`} alt="Graph" />
          ) : (
            <p>Загрузка графика...</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">График по статусам тикетов</h2>
        <div className="mt-4">
          {statusChartData ? (
            <img src={`data:image/png;base64,${statusChartData}`} alt="Status Tickets Graph" />
          ) : (
            <p>Загрузка графика...</p>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setImportFile(e.target.files[0])}
        />
        <button
          onClick={handleImportClick}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 ml-4"
        >
          Импортировать данные
        </button>
        <button
          onClick={handleExportClick}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 ml-4"
        >
          Экспортировать данные
        </button>
      </div>
    </div>
  );
}
