import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '../../components/messages/MessageBubble';

describe('MessageBubble Component', () => {
  const mockMessage = {
    id: 1,
    senderId: 1,
    senderName: 'Test Sender',
    senderEmail: 'sender@test.com',
    senderImageUrl: undefined,
    receiverId: 2,
    receiverName: 'Test Receiver',
    receiverEmail: 'receiver@test.com',
    receiverImageUrl: undefined,
    content: 'Hello, this is a test message',
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  describe('rendering', () => {
    it('debe renderizar el contenido del mensaje', () => {
      render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
      
      expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    });

    it('debe renderizar el nombre del remitente', () => {
      render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
      
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('debe mostrar indicador de no leído para mensaje propio', () => {
      render(<MessageBubble message={mockMessage} isOwnMessage={true} />);
      
      expect(screen.getByText('Enviado')).toBeInTheDocument();
    });

    it('debe mostrar indicador de leído para mensaje propio leído', () => {
      const readMessage = { ...mockMessage, isRead: true };
      render(<MessageBubble message={readMessage} isOwnMessage={true} />);
      
      expect(screen.getByText('✓✓ Leído')).toBeInTheDocument();
    });

    it('debe renderizar con estilos diferentes para mensaje propio vs otro', () => {
      const { rerender } = render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
      
      const bubbleOwnMessage = document.querySelector('.bg-gray-800');
      expect(bubbleOwnMessage).toBeInTheDocument();

      rerender(<MessageBubble message={mockMessage} isOwnMessage={true} />);
      
      const bubbleOwn = document.querySelector('.bg-gradient-to-r');
      expect(bubbleOwn).toBeInTheDocument();
    });
  });

  describe('avatars', () => {
    it('debe ocultar avatar cuando showAvatar es false', () => {
      render(<MessageBubble message={mockMessage} isOwnMessage={false} showAvatar={false} />);
      
      const avatars = document.querySelectorAll('.rounded-full.bg-gradient-to-br');
      expect(avatars.length).toBe(0);
    });

    it('debe mostrar avatar cuando showAvatar es true', () => {
      render(<MessageBubble message={mockMessage} isOwnMessage={false} showAvatar={true} />);
      
      const avatars = document.querySelectorAll('.rounded-full.bg-gradient-to-br');
      expect(avatars.length).toBe(1);
    });

    it('debe mostrar imagen de perfil si existe', () => {
      const messageWithImage = {
        ...mockMessage,
        senderImageUrl: 'https://example.com/avatar.jpg',
      };
      render(<MessageBubble message={messageWithImage} isOwnMessage={false} showAvatar={true} />);
      
      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img?.src).toBe('https://example.com/avatar.jpg');
    });
  });

  describe('message states', () => {
    it('debe mostrar texto de tiempo relativo', () => {
      render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
      
      const timeElement = document.querySelector('.text-gray-500');
      expect(timeElement).toBeInTheDocument();
    });

    it('debe manejar mensaje vacío', () => {
      const emptyMessage = { ...mockMessage, content: '' };
      render(<MessageBubble message={emptyMessage} isOwnMessage={false} />);
      
      expect(screen.getByText('')).toBeInTheDocument();
    });

    it('debe renderizar mensaje largo sin problemas', () => {
      const longMessage = {
        ...mockMessage,
        content: 'A'.repeat(500),
      };
      render(<MessageBubble message={longMessage} isOwnMessage={false} />);
      
      const textElement = screen.getByText(/A{500}/);
      expect(textElement).toBeInTheDocument();
    });
  });
});