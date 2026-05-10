import { Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import BoardDetailPage from './pages/BoardDetailPage';

function App() {
  return (
    <div>
      <nav style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <Link to="/" style={{ marginRight: '20px', color: '#007bff', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link to="/boards" style={{ marginRight: '20px', color: '#007bff', textDecoration: 'none' }}>
          Boards
        </Link>
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/boards" element={<BoardPage />} />
          <Route path="/boards/:id" element={<BoardDetailPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
