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

  describe('GET /api/v1/conversations', () => {
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
  });

  describe('GET /api/v1/conversations', () => {
    it('(index) deve buscar todas as conversas com sucesso com paginação', async () => {
      await ConversationFactory.createManyConversations(10, {
        createdBy: user.id,
      });

      const response = await request(server)
        .get(`${apiUrl}`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          page: 1,
          per_page: 2,
        });
      
      expect(response.status).toBe(StatusCode.OK);
      
      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      
      expect(response.body.data).toHaveLength(2);
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
      
      expect(response.body.pagination.total).toBe(10);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.per_page).toBe(2);
      expect(response.body.pagination.total_pages).toBe(5);
      expect(response.body.pagination.has_next_page).toBe(true);
      expect(response.body.pagination.has_previous_page).toBe(false);
    });
  });
});
