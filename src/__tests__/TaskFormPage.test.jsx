import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BoardDetailPage from '../pages/BoardDetailPage';
import * as api from '../services/api';

vi.mock('../services/api');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

describe('BoardDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders board heading and in-board task form', async () => {
    api.getBoard.mockResolvedValue({ data: { id: 1, name: 'Sprint 1' } });
    api.getTasksByBoard.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <BoardDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sprint 1')).toBeInTheDocument();
      expect(screen.getByText('Add Task')).toBeInTheDocument();
    });
  });

  it('shows tasks that belong to the board', async () => {
    api.getBoard.mockResolvedValue({ data: { id: 1, name: 'Sprint 1' } });
    api.getTasksByBoard.mockResolvedValue({
      data: [{ id: 1, title: 'Task A', description: 'In board', status: 'OPEN' }],
    });

    render(
      <BrowserRouter>
        <BoardDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Task A')).toBeInTheDocument();
      expect(screen.getByText('In board')).toBeInTheDocument();
    });
  });
});
