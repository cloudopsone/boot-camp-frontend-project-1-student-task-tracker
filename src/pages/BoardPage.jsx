import React, { useEffect, useState } from 'react';
import { getBoards, deleteBoard, createBoard } from '../services/api';
import { Link } from 'react-router-dom';

function BoardPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await getBoards();
      setBoards(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load boards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) {
      setError('Board name cannot be empty');
      return;
    }

    try {
      const response = await createBoard({ name: newBoardName });
      setBoards([...boards, response.data]);
      setNewBoardName('');
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create board');
      console.error(err);
    }
  };

  const handleDeleteBoard = async (id) => {
    if (window.confirm('Delete this board?')) {
      try {
        await deleteBoard(id);
        setBoards(boards.filter((board) => board.id !== id));
      } catch (err) {
        setError('Failed to delete board');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Boards</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {showForm ? 'Cancel' : 'New Board'}
      </button>

      {showForm && (
        <form
          onSubmit={handleCreateBoard}
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <label>Board Name: </label>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              style={{
                marginLeft: '10px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '300px',
              }}
              placeholder="Enter board name"
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Create Board
          </button>
        </form>
      )}

      {boards.length === 0 ? (
        <p>No boards found. Create one to get started!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {boards.map((board) => (
            <div
              key={board.id}
              style={{
                padding: '20px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ margin: '0 0 15px 0' }}>{board.name}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                ID: {board.id}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to={`/boards/${board.id}`}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BoardPage;
