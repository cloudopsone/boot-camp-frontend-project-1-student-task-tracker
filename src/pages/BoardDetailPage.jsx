import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getBoard,
  getTasksByBoard,
  createTask,
  updateTask,
  deleteTask,
} from '../services/api';

function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN',
    dueDate: '',
  });

  useEffect(() => {
    fetchBoardAndTasks();
  }, [id]);

  const fetchBoardAndTasks = async () => {
    try {
      setLoading(true);
      const [boardResponse, tasksResponse] = await Promise.all([
        getBoard(id),
        getTasksByBoard(id),
      ]);
      setBoard(boardResponse.data);
      setTasks(tasksResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load board or tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setFormError(null);
    setFormData({
      title: '',
      description: '',
      status: 'OPEN',
      dueDate: '',
    });
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setFormError(null);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'OPEN',
      dueDate: task.dueDate || '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormError(null);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveTask = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    if (!title) {
      setFormError('Task title is required');
      return;
    }
    if (title.length < 3 || title.length > 150) {
      setFormError('Title must be between 3 and 150 characters');
      return;
    }
    if (formData.description.length > 500) {
      setFormError('Description cannot exceed 500 characters');
      return;
    }

    const payload = {
      ...formData,
      title,
      boardId: Number(id),
    };

    try {
      if (editingTaskId) {
        const response = await updateTask(editingTaskId, payload);
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTaskId ? response.data : task))
        );
      } else {
        const response = await createTask(payload);
        setTasks((prev) => [...prev, response.data]);
      }
      resetForm();
    } catch (err) {
      const backendMessage =
        err?.response?.data?.errors?.title ||
        err?.response?.data?.message ||
        'Failed to save task';
      setFormError(backendMessage);
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!board) return <div>Board not found</div>;

  const statusColors = {
    OPEN: '#ffc107',
    IN_PROGRESS: '#0dcaf0',
    DONE: '#198754',
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0' }}>{board.name}</h1>
          <button
            onClick={() => navigate('/boards')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Back to Boards
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form
        onSubmit={handleSaveTask}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          backgroundColor: '#fafafa',
        }}
      >
        <h3 style={{ marginTop: 0 }}>{editingTaskId ? 'Edit Task' : 'Add Task'}</h3>
        {formError && <div style={{ color: 'red', marginBottom: '10px' }}>{formError}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task title"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Task description"
          style={{
            marginTop: '12px',
            width: '100%',
            minHeight: '90px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            style={{
              padding: '8px 14px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {editingTaskId ? 'Update Task' : 'Create Task'}
          </button>
          {editingTaskId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '8px 14px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks in this board.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                Title
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                Description
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
              <tr key={task.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {task.title}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {task.description}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  <span
                    style={{
                      padding: '5px 10px',
                      backgroundColor: statusColors[task.status] || '#ccc',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {task.status === 'OPEN' ? 'Open' : task.status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEditTask(task)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#0d6efd',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
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

export default BoardDetailPage;
