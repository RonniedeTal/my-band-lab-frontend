import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConversationList } from '../../components/messages/ConversationList';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, name: 'Test', surname: 'User' },
    isAuthenticated: () => true,
  })),
}));

describe('ConversationList Component', () => {
  const mockConversations = [
    {
      partnerId: 2,
      partnerName: 'Artist One',
      partnerEmail: 'artist1@test.com',
      partnerImageUrl: undefined,
      lastMessageId: 10,
      lastMessageContent: 'Hello there!',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 2,
      totalMessages: 5,
    },
    {
      partnerId: 3,
      partnerName: 'Artist Two',
      partnerEmail: 'artist2@test.com',
      partnerImageUrl: 'https://example.com/avatar.jpg',
      lastMessageId: 9,
      lastMessageContent: 'Bye!',
      lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
      unreadCount: 0,
      totalMessages: 3,
    },
  ];

  describe('rendering conversations', () => {
    it('debe renderizar lista de conversaciones', () => {
      render(
        <MemoryRouter>
          <ConversationList conversations={mockConversations} />
        </MemoryRouter>
      );

      expect(screen.getByText('Artist One')).toBeInTheDocument();
      expect(screen.getByText('Artist Two')).toBeInTheDocument();
    });

    it('debe renderizar ultimo mensaje de cada conversacion', () => {
      render(
        <MemoryRouter>
          <ConversationList conversations={mockConversations} />
        </MemoryRouter>
      );

      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText('Bye!')).toBeInTheDocument();
    });

    it('debe mostrar contador de mensajes no leidos', () => {
      render(
        <MemoryRouter>
          <ConversationList conversations={mockConversations} />
        </MemoryRouter>
      );

      const unreadBadge = document.querySelector('.bg-red-500');
      expect(unreadBadge).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('debe mostrar imagen de perfil si existe', () => {
      render(
        <MemoryRouter>
          <ConversationList conversations={mockConversations} />
        </MemoryRouter>
      );

      const images = document.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('empty state', () => {
    it('debe mostrar mensaje cuando no hay conversaciones', () => {
      render(
        <MemoryRouter>
          <ConversationList conversations={[]} />
        </MemoryRouter>
      );

      expect(screen.getByText('No hay conversaciones')).toBeInTheDocument();
      expect(screen.getByText('Contacta a un artista para iniciar una conversación')).toBeInTheDocument();
    });
  });

  describe('conversation item', () => {
    it('debe mostrar nombre truncado si es largo', () => {
      const longNameConversation = [
        {
          ...mockConversations[0],
          partnerName: 'A very long name that should be truncated in the display',
        },
      ];

      render(
        <MemoryRouter>
          <ConversationList conversations={longNameConversation} />
        </MemoryRouter>
      );

      expect(screen.getByText('A very long name...')).toBeInTheDocument();
    });

    it('debe mostrar icono inicial cuando no hay imagen', () => {
      render(
        <MemoryRouter>
          <ConversationList conversations={mockConversations} />
        </MemoryRouter>
      );

      const initial = document.querySelectorAll('span.text-lg');
      expect(initial.length).toBeGreaterThan(0);
    });
  });

  describe('active conversation', () => {
    it('debe aplicar estilo visual diferente a conversacion activa', () => {
      render(
        <MemoryRouter>
          <ConversationList
            conversations={mockConversations}
            activeConversationId={2}
          />
        </MemoryRouter>
      );

      const activeItem = document.querySelector('.bg-purple-600\\/20');
      expect(activeItem).toBeInTheDocument();
    });
  });
});