import { StatusCode } from '@/constants/status-code.constants';
import app from '@/server';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import setupTestDB from '@/tests/hooks/setup-db';
import { Server } from 'http';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let server: Server;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

const apiUrl: string = '/api/v1/auth';

describe('Autenticação', () => {
  setupTestDB();

  it('deve cadastrar um novo usuário com sucesso', async () => {
    const userData = UserFactory.makeUserData();

    const response = await request(server).post(`${apiUrl}/register`).send(userData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Usuário criado com sucesso.');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name', userData.name);
    expect(response.body.user).toHaveProperty('email', userData.email);
  });

  it('deve autenticar um usuário e retornar um token', async () => {
    const { loginData } = await UserFactory.createUserAndGetLoginData();

    const response = await request(server).post(`${apiUrl}/login`).send(loginData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Login realizado com sucesso.');
    expect(response.body.token).toHaveProperty('accessToken');
    expect(response.body.token).toHaveProperty('expiresIn');
    expect(response.body.token).toHaveProperty('tokenType', 'Bearer');
  });

  it('deve resetar a senha de um usuário com sucesso', async () => {
    const { user } = await UserFactory.createUserAndGetLoginData();

    const response = await request(server).post(`${apiUrl}/reset-password`).send({
      email: user.email,
    });

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Senha resetada com sucesso.');
    expect(response.body).toHaveProperty('newPassword');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email', user.email);
  });

  it('deve alterar a senha de um usuário autenticado com sucesso', async () => {
    const { user, loginData } = await UserFactory.createUserAndGetLoginData();
    const loginResponse = await request(server).post(`${apiUrl}/login`).send(loginData);
    const token = loginResponse.body.token.accessToken;

    const newPassword = 'novaSenha123';
    const response = await request(server)
      .put(`${apiUrl}/change-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: loginData.password,
        newPassword,
      });

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Senha alterada com sucesso.');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email', user.email);

    const newLoginResponse = await request(server).post(`${apiUrl}/login`).send({
      email: user.email,
      password: newPassword,
    });

    expect(newLoginResponse.status).toBe(StatusCode.OK);
    expect(newLoginResponse.body.token).toHaveProperty('accessToken');
  });

  it('deve falhar ao resetar senha com email inexistente', async () => {
    const response = await request(server).post(`${apiUrl}/reset-password`).send({
      email: 'email@inexistente.com',
    });

    expect(response.status).toBe(StatusCode.NOT_FOUND);
    expect(response.body.message).toBe('Usuário não encontrado');
  });

  it('deve falhar ao alterar senha com senha atual incorreta', async () => {
    const { loginData } = await UserFactory.createUserAndGetLoginData();
    const loginResponse = await request(server).post(`${apiUrl}/login`).send(loginData);
    const token = loginResponse.body.token.accessToken;

    const response = await request(server)
      .put(`${apiUrl}/change-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'senhaIncorreta',
        newPassword: 'novaSenha123',
      });

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Senha atual incorreta');
  });

  it('deve falhar ao alterar senha sem autenticação', async () => {
    const response = await request(server).put(`${apiUrl}/change-password`).send({
      currentPassword: 'senhaAtual',
      newPassword: 'novaSenha123',
    });

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Token não fornecido');
  });

  it('deve atualizar o nome do usuário com sucesso', async () => {
    const { user, loginData } = await UserFactory.createUserAndGetLoginData();
    const loginResponse = await request(server).post(`${apiUrl}/login`).send(loginData);
    const token = loginResponse.body.token.accessToken;

    const newName = 'Novo Nome do Usuário';
    const response = await request(server).put(`${apiUrl}/profile`).set('Authorization', `Bearer ${token}`).send({
      name: newName,
    });

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Usuário atualizado com sucesso.');
    expect(response.body.user).toHaveProperty('name', newName);
    expect(response.body.user).toHaveProperty('email', user.email);
  });

  it('deve atualizar múltiplos campos do usuário com sucesso', async () => {
    const { user, loginData } = await UserFactory.createUserAndGetLoginData();
    const loginResponse = await request(server).post(`${apiUrl}/login`).send(loginData);
    const token = loginResponse.body.token.accessToken;

    const newName = 'Nome Atualizado';
    const newPassword = 'novaSenha789';
    const response = await request(server).put(`${apiUrl}/profile`).set('Authorization', `Bearer ${token}`).send({
      name: newName,
      currentPassword: loginData.password,
      newPassword,
    });

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Usuário atualizado com sucesso.');
    expect(response.body.user).toHaveProperty('name', newName);
    expect(response.body.user).toHaveProperty('email', user.email);

    const newLoginResponse = await request(server).post(`${apiUrl}/login`).send({
      email: user.email,
      password: newPassword,
    });

    expect(newLoginResponse.status).toBe(StatusCode.OK);
    expect(newLoginResponse.body.token).toHaveProperty('accessToken');
  });

  it('deve atualizar a senha junto com outros campos', async () => {
    const { loginData } = await UserFactory.createUserAndGetLoginData();
    const loginResponse = await request(server).post(`${apiUrl}/login`).send(loginData);
    const token = loginResponse.body.token.accessToken;

    const newName = 'Nome com Senha Nova';
    const newPassword = 'novaSenha456';
    const response = await request(server).put(`${apiUrl}/profile`).set('Authorization', `Bearer ${token}`).send({
      name: newName,
      currentPassword: loginData.password,
      newPassword,
    });

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Usuário atualizado com sucesso.');
    expect(response.body.user).toHaveProperty('name', newName);

    const newLoginResponse = await request(server).post(`${apiUrl}/login`).send({
      email: loginData.email,
      password: newPassword,
    });

    expect(newLoginResponse.status).toBe(StatusCode.OK);
    expect(newLoginResponse.body.token).toHaveProperty('accessToken');
  });

  it('deve falhar ao atualizar usuário sem fornecer campos', async () => {
    const { loginData } = await UserFactory.createUserAndGetLoginData();
    const loginResponse = await request(server).post(`${apiUrl}/login`).send(loginData);
    const token = loginResponse.body.token.accessToken;

    const response = await request(server).put(`${apiUrl}/profile`).set('Authorization', `Bearer ${token}`).send({});

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
  });

  it('deve falhar ao atualizar senha sem fornecer senha atual', async () => {
    const { loginData } = await UserFactory.createUserAndGetLoginData();
    const loginResponse = await request(server).post(`${apiUrl}/login`).send(loginData);
    const token = loginResponse.body.token.accessToken;

    const response = await request(server).put(`${apiUrl}/profile`).set('Authorization', `Bearer ${token}`).send({
      newPassword: 'novaSenha123',
    });

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
  });
});
