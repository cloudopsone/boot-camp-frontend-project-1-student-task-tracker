import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../pages/DashboardPage';
import * as api from '../services/api';

vi.mock('../services/api');

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard heading', async () => {
    (api.getBoards as any).mockResolvedValue({ data: [] });
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('displays board and task statistics', async () => {
    (api.getBoards as any).mockResolvedValue({
      data: [
        { id: 1, name: 'Board 1' },
        { id: 2, name: 'Board 2' },
      ],
    });
    (api.getTasksByBoard as any)
      .mockResolvedValueOnce({
        data: [
          { id: 1, status: 'OPEN' },
          { id: 2, status: 'DONE' },
        ],
      })
      .mockResolvedValueOnce({
        data: [{ id: 3, status: 'IN_PROGRESS' }],
      });
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Boards')).toBeInTheDocument();
      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Open Tasks')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });
});
