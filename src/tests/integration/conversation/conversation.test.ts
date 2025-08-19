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
          search: 'teste',
        });
    });
  });
});
