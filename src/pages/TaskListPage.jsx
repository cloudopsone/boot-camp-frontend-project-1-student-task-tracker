import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../services/api';
import { Link } from 'react-router-dom';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      let filtered = response.data;

      if (filter) {
        filtered = filtered.filter((task) => task.status === filter);
      }

      setTasks(filtered);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((task) => task.id !== id));
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Task List</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Filter by status: </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                Title
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                Status
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                Due Date
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ccc' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                    {task.title}
                  </Link>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{task.status}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {task.dueDate || 'N/A'}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    style={{ marginRight: '10px', color: '#007bff', textDecoration: 'none' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskListPage;
