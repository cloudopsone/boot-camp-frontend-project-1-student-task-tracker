import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, createTask, updateTask } from '../services/api';

interface FormData {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  boardId: number;
}

interface Errors {
  [key: string]: string;
}

function TaskFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'OPEN',
    dueDate: '',
    boardId: 1,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await getTask(Number(id));
      setFormData({
        title: response.data.title,
        description: response.data.description || '',
        status: response.data.status,
        dueDate: response.data.dueDate || '',
        boardId: response.data.boardId,
      });
    } catch (err) {
      console.error('Failed to load task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'boardId' ? Number(value) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (id) {
        await updateTask(Number(id), formData);
        alert('Task updated successfully!');
      } else {
        await createTask(formData);
        alert('Task created successfully!');
      }
      navigate('/tasks');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save task';
      setErrors((prev) => ({
        ...prev,
        submit: errorMsg,
      }));
      console.error('Failed to save task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1>{id ? 'Edit Task' : 'Create New Task'}</h1>

      {errors.submit && <div style={{ color: 'red', marginBottom: '15px' }}>{errors.submit}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.title ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="Enter task title"
          />
          {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.description ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '100px',
            }}
            placeholder="Enter task description"
          />
          {errors.description && (
            <span style={{ color: 'red', fontSize: '12px' }}>{errors.description}</span>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.status ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          {errors.status && <span style={{ color: 'red', fontSize: '12px' }}>{errors.status}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Board ID</label>
          <input
            type="number"
            name="boardId"
            value={formData.boardId}
            onChange={handleChange}
            disabled
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Saving...' : id ? 'Update Task' : 'Create Task'}
          </button>
          <button
            type="button"
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
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskFormPage;
