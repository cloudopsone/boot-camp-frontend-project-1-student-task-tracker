import React, { useEffect, useState } from 'react';
import { getBoards, getTasksByBoard } from '../services/api';

function DashboardPage() {
  const [stats, setStats] = useState({
    boards: 0,
    tasks: 0,
    open: 0,
    inProgress: 0,
    done: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const boardsResponse = await getBoards();
        const boards = boardsResponse.data || [];
        const taskResponses = await Promise.all(
          boards.map((board) => getTasksByBoard(board.id))
        );

        const allTasks = taskResponses.flatMap((response) => response.data || []);

        setStats({
          boards: boards.length,
          tasks: allTasks.length,
          open: allTasks.filter((task) => task.status === 'OPEN').length,
          inProgress: allTasks.filter((task) => task.status === 'IN_PROGRESS').length,
          done: allTasks.filter((task) => task.status === 'DONE').length,
        });
      } catch (error) {
        setError('Failed to fetch dashboard stats');
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
          <h3>Total Boards</h3>
          <p style={{ fontSize: '32px', margin: '10px 0' }}>{stats.boards}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
          <h3>Total Tasks</h3>
          <p style={{ fontSize: '32px', margin: '10px 0' }}>{stats.tasks}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
          <h3>Open Tasks</h3>
          <p style={{ fontSize: '32px', margin: '10px 0' }}>{stats.open}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
          <h3>In Progress</h3>
          <p style={{ fontSize: '32px', margin: '10px 0' }}>{stats.inProgress}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
          <h3>Done</h3>
          <p style={{ fontSize: '32px', margin: '10px 0' }}>{stats.done}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
