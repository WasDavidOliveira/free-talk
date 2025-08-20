import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { MessageFactory } from '@/tests/factories/message/message.factory';
import { ConversationFactory } from '@/tests/factories/conversation/conversation.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import { UserModel } from '@/types/models/v1/auth.types';
import { StatusCode } from '@/constants/status-code.constants';
import { MessageType } from '@/enums/v1/modules/chat/message-types.enum';

let server: Server;
let token: string;
let user: UserModel;

beforeAll(async () => {
  server = app.listen();

  const loginData = await UserFactory.createUserAndGetToken();

  token = loginData.token;
  user = loginData.user;
});

afterAll(() => {
  server.close();
});

describe('Mensagens', () => {
  setupTestDB();

  describe('(index) GET /api/v1/conversations/:conversationId/messages', () => {
    it('deve listar mensagens da conversa com sucesso', async () => {
      const { conversation } = await MessageFactory.createConversationWithMessages(
        user.id,
        5
      );

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.OK);

      expect(response.body.message).toBe('Mensagens listadas com sucesso.');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(5);

      const firstMessage = response.body.data[0];
      expect(firstMessage.id).toBeDefined();
      expect(firstMessage.content).toBeDefined();
      expect(firstMessage.messageType).toBeDefined();
      expect(firstMessage.createdAt).toBeDefined();
      expect(firstMessage.sender).toBeDefined();
      expect(firstMessage.sender.id).toBe(user.id);
      expect(firstMessage.sender.name).toBe(user.name);
    });

    it('deve retornar erro 403 se usuário não tem acesso à conversa', async () => {
      const { user: otherUser } = await UserFactory.createUser();
      const conversation = await ConversationFactory.createConversation({
        createdBy: otherUser.id,
      });

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.FORBIDDEN);

      expect(response.body.message).toContain('Você não tem acesso a esta conversa');
    });

    it('deve funcionar com paginação', async () => {
      const { conversation } = await MessageFactory.createConversationWithMessages(
        user.id,
        15
      );

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages?page=1&per_page=5`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.OK);

      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.per_page).toBe(5);
      expect(response.body.pagination.total).toBe(15);
      expect(response.body.pagination.total_pages).toBe(3);
    });
  });

  describe('(show) GET /api/v1/conversations/:conversationId/messages/:messageId', () => {
    it('deve buscar mensagem específica com sucesso', async () => {
      const { conversation, messages } = await MessageFactory.createConversationWithMessages(
        user.id,
        3
      );
      const targetMessage = messages[0];

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages/${targetMessage.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.OK);

      expect(response.body.message).toBe('Mensagem encontrada com sucesso.');
      expect(response.body.data.id).toBe(targetMessage.id);
      expect(response.body.data.content).toBe(targetMessage.content);
      expect(response.body.data.sender.id).toBe(user.id);
    });

    it('deve retornar erro 404 se mensagem não existe', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages/999999`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.NOT_FOUND);

      expect(response.body.message).toBe('Mensagem não encontrada');
    });

    it('deve retornar erro 403 se usuário não tem acesso à conversa', async () => {
      const { user: otherUser } = await UserFactory.createUser();
      const { conversation, messages } = await MessageFactory.createConversationWithMessages(
        otherUser.id,
        1
      );

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages/${messages[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.FORBIDDEN);

      expect(response.body.message).toContain('Você não tem acesso a esta conversa');
    });
  });

  describe('(create) POST /api/v1/conversations/:conversationId/messages', () => {
    it('deve criar mensagem com sucesso', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const messageData = {
        content: 'Esta é uma mensagem de teste',
        messageType: MessageType.TEXT,
      };

      const response = await request(server)
        .post(`/api/v1/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send(messageData)
        .expect(StatusCode.CREATED);

      expect(response.body.message).toBe('Mensagem criada com sucesso.');
      expect(response.body.data.content).toBe(messageData.content);
      expect(response.body.data.messageType).toBe(messageData.messageType);
      expect(response.body.data.sender.id).toBe(user.id);
      expect(response.body.data.conversationId).toBe(conversation.id);
    });

    it('deve criar mensagem como participante da conversa', async () => {
      const { user: otherUser } = await UserFactory.createUser();
      const conversation = await ConversationFactory.createConversation({
        createdBy: otherUser.id,
      });

      await ConversationFactory.addParticipantsToConversation(conversation.id, [user]);

      const messageData = {
        content: 'Mensagem de participante',
        messageType: MessageType.TEXT,
      };

      const response = await request(server)
        .post(`/api/v1/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send(messageData)
        .expect(StatusCode.CREATED);

      expect(response.body.data.content).toBe(messageData.content);
      expect(response.body.data.sender.id).toBe(user.id);
    });

    it('deve retornar erro 403 se usuário não tem acesso à conversa', async () => {
      const { user: otherUser } = await UserFactory.createUser();
      const conversation = await ConversationFactory.createConversation({
        createdBy: otherUser.id,
      });

      const messageData = {
        content: 'Mensagem não autorizada',
        messageType: MessageType.TEXT,
      };

      const response = await request(server)
        .post(`/api/v1/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send(messageData)
        .expect(StatusCode.FORBIDDEN);

      expect(response.body.message).toContain('Você não tem acesso a esta conversa');
    });

    it('deve retornar erro 400 se conteúdo está vazio', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const messageData = {
        content: '',
        messageType: MessageType.TEXT,
      };

      const response = await request(server)
        .post(`/api/v1/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send(messageData)
        .expect(StatusCode.BAD_REQUEST);

      expect(response.body.message).toContain('Dados inválidos na requisição');
    });
  });

  describe('(update) PUT /api/v1/conversations/:conversationId/messages/:messageId', () => {
    it('deve atualizar mensagem própria com sucesso', async () => {
      const { conversation, messages } = await MessageFactory.createConversationWithMessages(
        user.id,
        1
      );
      const targetMessage = messages[0];

      const updateData = {
        content: 'Mensagem editada',
      };

      const response = await request(server)
        .put(`/api/v1/conversations/${conversation.id}/messages/${targetMessage.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(StatusCode.OK);

      expect(response.body.message).toBe('Mensagem atualizada com sucesso.');
      expect(response.body.data.content).toBe(updateData.content);
      expect(response.body.data.id).toBe(targetMessage.id);
    });

    it('deve retornar erro 403 se tentar editar mensagem de outro usuário', async () => {
      const { user: otherUser } = await UserFactory.createUser();
      const { conversation, messages } = await MessageFactory.createConversationWithMessages(
        otherUser.id,
        1
      );

      await ConversationFactory.addParticipantsToConversation(conversation.id, [user]);

      const updateData = {
        content: 'Tentativa de edição não autorizada',
      };

      const response = await request(server)
        .put(`/api/v1/conversations/${conversation.id}/messages/${messages[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(StatusCode.FORBIDDEN);

      expect(response.body.message).toBe('Você só pode editar suas próprias mensagens');
    });

    it('deve retornar erro 404 se mensagem não existe', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const updateData = {
        content: 'Tentativa de edição de mensagem inexistente',
      };

      const response = await request(server)
        .put(`/api/v1/conversations/${conversation.id}/messages/999999`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(StatusCode.NOT_FOUND);

      expect(response.body.message).toBe('Mensagem não encontrada');
    });
  });

  describe('(delete) DELETE /api/v1/conversations/:conversationId/messages/:messageId', () => {
    it('deve deletar mensagem própria com sucesso', async () => {
      const { conversation, messages } = await MessageFactory.createConversationWithMessages(
        user.id,
        1
      );
      const targetMessage = messages[0];

      const response = await request(server)
        .delete(`/api/v1/conversations/${conversation.id}/messages/${targetMessage.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.OK);

      expect(response.body.message).toBe('Mensagem deletada com sucesso.');

      await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages/${targetMessage.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.NOT_FOUND);
    });

    it('deve retornar erro 403 se participante tentar deletar mensagem de outro', async () => {
      const { user: creatorUser } = await UserFactory.createUser();
      const { user: participantUser } = await UserFactory.createUser();
      const participantToken = UserFactory.generateJwtToken(participantUser.id);

      const conversation = await ConversationFactory.createConversation({
        createdBy: creatorUser.id,
      });

      await ConversationFactory.addParticipantsToConversation(conversation.id, [participantUser]);

      const creatorMessage = await MessageFactory.createMessage({
        conversationId: conversation.id,
        senderId: creatorUser.id,
        content: 'Mensagem do criador',
      });

      const response = await request(server)
        .delete(`/api/v1/conversations/${conversation.id}/messages/${creatorMessage.id}`)
        .set('Authorization', `Bearer ${participantToken}`)
        .expect(StatusCode.FORBIDDEN);

      expect(response.body.message).toBe('Você não tem permissão para deletar esta mensagem');
    });
  });

  describe('(markAsRead) POST /api/v1/conversations/:conversationId/messages/mark-as-read', () => {
    it('deve marcar mensagens como lidas com sucesso', async () => {
      const { conversation, messages } = await MessageFactory.createConversationWithMessages(
        user.id,
        3
      );

      const messageIds = messages.map(m => m.id);

      const response = await request(server)
        .post(`/api/v1/conversations/${conversation.id}/messages/mark-as-read`)
        .set('Authorization', `Bearer ${token}`)
        .send({ messageIds })
        .expect(StatusCode.OK);

      expect(response.body.message).toBe('Mensagens marcadas como lidas com sucesso.');
    });

    it('deve retornar erro 400 se messageIds está vazio', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const response = await request(server)
        .post(`/api/v1/conversations/${conversation.id}/messages/mark-as-read`)
        .set('Authorization', `Bearer ${token}`)
        .send({ messageIds: [] })
        .expect(StatusCode.BAD_REQUEST);

      expect(response.body.message).toContain('Dados inválidos na requisição');
    });

    it('deve retornar erro 400 se mensagem não pertence à conversa', async () => {
      const conversation1 = await ConversationFactory.createConversation({
        createdBy: user.id,
      });
      
      const { messages } = await MessageFactory.createConversationWithMessages(
        user.id,
        1
      );

      const response = await request(server)
        .post(`/api/v1/conversations/${conversation1.id}/messages/mark-as-read`)
        .set('Authorization', `Bearer ${token}`)
        .send({ messageIds: [messages[0].id] })
        .expect(StatusCode.BAD_REQUEST);

      expect(response.body.message).toContain('não encontrada nesta conversa');
    });
  });

  describe('(getUnreadCount) GET /api/v1/conversations/:conversationId/messages/unread-count', () => {
    it('deve retornar contagem de mensagens não lidas', async () => {
      const { conversation } = await MessageFactory.createConversationWithMessages(
        user.id,
        5
      );

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages/unread-count`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.OK);

      expect(response.body.message).toBe('Contagem de mensagens não lidas obtida com sucesso.');
      expect(response.body.data.unreadCount).toBeDefined();
      expect(typeof response.body.data.unreadCount).toBe('number');
    });

    it('deve retornar erro 403 se usuário não tem acesso à conversa', async () => {
      const { user: otherUser } = await UserFactory.createUser();
      const conversation = await ConversationFactory.createConversation({
        createdBy: otherUser.id,
      });

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages/unread-count`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCode.FORBIDDEN);

      expect(response.body.message).toContain('Você não tem acesso a esta conversa');
    });
  });

  describe('Cenários com múltiplos usuários', () => {
    it('deve permitir múltiplos usuários enviarem mensagens na mesma conversa', async () => {
      const { conversation, users, messages: _messages } = await MessageFactory.createConversationWithMultipleUsers(
        3,
        2
      );

      const creatorToken = UserFactory.generateJwtToken(users[0].id);

      const response = await request(server)
        .get(`/api/v1/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .expect(StatusCode.OK);

      expect(response.body.data.length).toBe(6);
      
      const senderIds = response.body.data.map((msg: any) => msg.sender.id);
      const uniqueSenderIds = [...new Set(senderIds)];
      expect(uniqueSenderIds.length).toBe(3);
    });
  });
});
