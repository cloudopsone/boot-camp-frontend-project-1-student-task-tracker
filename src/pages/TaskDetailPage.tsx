import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask } from '../services/api';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  boardId: number;
  dueDate?: string;
  boardName?: string;
  createdByName?: string;
  createdAt?: string;
}

function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await getTask(Number(id));
      setTask(response.data);
    } catch (err) {
      console.error('Failed to load task:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!task) return <div>Task not found</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>{task.title}</h1>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Status: </label>
        <span>{task.status}</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Description: </label>
        <p>{task.description || 'N/A'}</p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Due Date: </label>
        <span>{task.dueDate || 'N/A'}</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Board: </label>
        <span>{task.boardName}</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Created By: </label>
        <span>{task.createdByName}</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Created At: </label>
        <span>{task.createdAt && new Date(task.createdAt).toLocaleString()}</span>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate(`/tasks/${id}/edit`)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Edit
        </button>
        <button
          onClick={() => navigate('/tasks')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default TaskDetailPage;
