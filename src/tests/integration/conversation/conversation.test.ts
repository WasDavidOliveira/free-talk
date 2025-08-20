import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import { ConversationFactory } from '@/tests/factories/conversation/conversation.factory';
import { UserModel } from '@/types/models/v1/auth.types';
import { StatusCode } from '@/constants/status-code.constants';

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

const apiUrl: string = '/api/v1/conversations';

describe('Conversas', () => {
  setupTestDB();

  describe('(index) GET /api/v1/conversations', () => {
    it('(index) deve buscar todas as conversas com sucesso', async () => {
      await ConversationFactory.createManyConversations(10, {
        createdBy: user.id,
      });

      const response = await request(server)
        .get(`${apiUrl}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.data[0].createdBy.id).toBe(user.id);
      expect(response.body.data[0].title).toBeDefined();
      expect(response.body.data[0].createdAt).toBeDefined();
      expect(response.body.data[0].updatedAt).toBeDefined();
      expect(response.body.data[0].createdBy.id).toBe(user.id);
      expect(response.body.data[0].createdBy.name).toBe(user.name);
    });

    it('(index) deve buscar todas as conversas com sucesso com paginação', async () => {
      let totalConversations = 10;
      let perPage = 2;
      let page = 1;
      let totalPages = Math.ceil(totalConversations / perPage);

      await ConversationFactory.createManyConversations(totalConversations, {
        createdBy: user.id,
      });

      const response = await request(server)
        .get(`${apiUrl}`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          page,
          per_page: perPage,
        });

      expect(response.status).toBe(StatusCode.OK);

      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination).toBeDefined();

      expect(response.body.data).toHaveLength(perPage);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('createdBy');
      expect(response.body.data[0]).toHaveProperty('createdAt');

      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('per_page');
      expect(response.body.pagination).toHaveProperty('total_pages');
      expect(response.body.pagination).toHaveProperty('has_next_page');
      expect(response.body.pagination).toHaveProperty('has_previous_page');

      expect(response.body.pagination.total).toBe(totalConversations);
      expect(response.body.pagination.page).toBe(page);
      expect(response.body.pagination.per_page).toBe(perPage);
      expect(response.body.pagination.total_pages).toBe(totalPages);
      expect(response.body.pagination.has_next_page).toBe(
        totalConversations > perPage
      );
      expect(response.body.pagination.has_previous_page).toBe(false);
    });
  });

  describe('(show) GET /api/v1/conversations/:id', () => {
    it('(show) deve buscar uma conversa com sucesso', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const response = await request(server)
        .get(`${apiUrl}/${conversation.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(conversation.id);
      expect(response.body.data.title).toBeDefined();
      expect(response.body.data.createdBy.id).toBe(user.id);
      expect(response.body.data.createdBy.name).toBe(user.name);
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
      expect(response.body.data.createdBy.id).toBe(user.id);
      expect(response.body.data.createdBy.name).toBe(user.name);
    });

    it('(show) deve retornar erro 404 se a conversa não for encontrada', async () => {
      let randomNumber = Math.floor(Math.random() * 100) + 1;

      const response = await request(server)
        .get(`${apiUrl}/` + randomNumber)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Conversa não encontrada');
    });
  });

  describe('(create) POST /api/v1/conversations', () => {
    it('(create) deve criar uma conversa com sucesso', async () => {
      const response = await request(server)
        .post(`${apiUrl}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Conversa de teste' });

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body.message).toBe('Conversa criada com sucesso.');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('Conversa de teste');
      expect(response.body.data.createdBy).toBeDefined();
      expect(response.body.data.createdBy.id).toBe(user.id);
    });

    it('(create) deve retornar erro 400 se o título não for informado', async () => {
      const response = await request(server)
        .post(`${apiUrl}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.errors[0].campo).toBe('title');
      expect(response.body.errors[0].mensagem).toBe('Título é obrigatório');
    });
  });

  describe('(update) PUT /api/v1/conversations/:id', () => {
    it('(update) deve atualizar uma conversa com sucesso', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const response = await request(server)
        .put(`${apiUrl}/${conversation.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Conversa de teste atualizada' });

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Conversa atualizada com sucesso.');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(conversation.id);
      expect(response.body.data.title).toBe('Conversa de teste atualizada');
      expect(response.body.data.createdBy.id).toBe(user.id);
    });

    it('(update) deve retornar erro 400 se o título não for informado', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const response = await request(server)
        .put(`${apiUrl}/${conversation.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(StatusCode.BAD_REQUEST);
      expect(response.body.errors[0].campo).toBe('title');
      expect(response.body.errors[0].mensagem).toBe('Título é obrigatório');
    });
  });

  describe('(delete) DELETE /api/v1/conversations/:id', () => {
    it('(delete) deve deletar uma conversa com sucesso', async () => {
      const conversation = await ConversationFactory.createConversation({
        createdBy: user.id,
      });

      const response = await request(server)
        .delete(`${apiUrl}/${conversation.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body.message).toBe('Conversa deletada com sucesso.');
    });

    it('(delete) deve retornar erro 404 se a conversa não for encontrada', async () => {
      let randomNumber = Math.floor(Math.random() * 100) + 1;

      const response = await request(server)
        .delete(`${apiUrl}/${randomNumber}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
      expect(response.body.message).toBe('Conversa não encontrada');
      expect(response.body.data).toBeUndefined();
    });
  });
});
