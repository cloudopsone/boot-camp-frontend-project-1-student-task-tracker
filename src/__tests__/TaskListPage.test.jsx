import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BoardPage from '../pages/BoardPage';
import * as api from '../services/api';

vi.mock('../services/api');

describe('BoardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders board list heading', async () => {
    api.getBoards.mockResolvedValue({
      data: [
        { id: 1, name: 'Board 1' },
      ],
    });
    
    render(
      <BrowserRouter>
        <BoardPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Boards')).toBeInTheDocument();
    });
  });

  it('shows create button', async () => {
    api.getBoards.mockResolvedValue({ data: [] });
    
    render(
      <BrowserRouter>
        <BoardPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('New Board')).toBeInTheDocument();
    });
  });

  it('renders board cards with view action', async () => {
    api.getBoards.mockResolvedValue({
      data: [
        { id: 1, name: 'Sprint 1' },
      ],
    });
    
    render(
      <BrowserRouter>
        <BoardPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Sprint 1')).toBeInTheDocument();
      expect(screen.getByText('View')).toBeInTheDocument();
    });
  });
});
