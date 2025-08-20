import { createDocument } from 'zod-openapi';
import path from 'path';
import fs from 'fs';
import * as z from 'zod';
import {
  loginSchema,
  registerSchema,
  userResponseSchema,
} from '@/validations/v1/modules/auth.validations';
import {
  createConversationSchema,
  updateConversationSchema,
  addParticipantsSchema,
} from '@/validations/v1/modules/conversation.validations';
import {
  createMessageSchema,
  updateMessageSchema,
  markAsReadSchema,
} from '@/validations/v1/modules/message.validations';

export const generateOpenAPIDocument = () => {
  const loginResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Login realizado com sucesso',
      }),
      user: userResponseSchema,
      token: z.string().openapi({
        description: 'Token JWT para autenticação',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      }),
    })
    .openapi({
      ref: 'LoginResponse',
      description: 'Resposta de login bem-sucedido',
    });

  const registerResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Usuário criado com sucesso',
      }),
      user: userResponseSchema,
    })
    .openapi({
      ref: 'RegisterResponse',
      description: 'Resposta de registro bem-sucedido',
    });

  const meResponseSchema = z
    .object({
      message: z.string().openapi({
        description: 'Mensagem de sucesso',
        example: 'Usuário encontrado com sucesso',
      }),
      user: userResponseSchema,
    })
    .openapi({
      ref: 'MeResponse',
      description: 'Resposta com dados do usuário atual',
    });

  const conversationResponseSchema = z
    .object({
      id: z.number().openapi({ description: 'ID da conversa', example: 1 }),
      title: z.string().openapi({ description: 'Título da conversa', example: 'Chat do projeto' }),
      createdBy: z.object({
        id: z.number().openapi({ description: 'ID do criador', example: 1 }),
        name: z.string().openapi({ description: 'Nome do criador', example: 'João Silva' }),
        email: z.string().openapi({ description: 'Email do criador', example: 'joao@exemplo.com' }),
      }),
      createdAt: z.string().openapi({ description: 'Data de criação', example: '2024-01-01T00:00:00Z' }),
      updatedAt: z.string().openapi({ description: 'Data de atualização', example: '2024-01-01T00:00:00Z' }),
    })
    .openapi({
      ref: 'ConversationResponse',
      description: 'Dados de uma conversa',
    });

  const conversationListResponseSchema = z
    .object({
      message: z.string().openapi({ description: 'Mensagem de sucesso', example: 'Conversas listadas com sucesso.' }),
      data: z.array(conversationResponseSchema),
      pagination: z.object({
        page: z.number().openapi({ description: 'Página atual', example: 1 }),
        per_page: z.number().openapi({ description: 'Itens por página', example: 10 }),
        total: z.number().openapi({ description: 'Total de itens', example: 50 }),
        total_pages: z.number().openapi({ description: 'Total de páginas', example: 5 }),
      }),
    })
    .openapi({
      ref: 'ConversationListResponse',
      description: 'Lista de conversas com paginação',
    });

  const participantResponseSchema = z
    .object({
      id: z.number().openapi({ description: 'ID do participante', example: 1 }),
      conversationId: z.number().openapi({ description: 'ID da conversa', example: 1 }),
      userId: z.number().openapi({ description: 'ID do usuário', example: 2 }),
      user: z.object({
        id: z.number().openapi({ description: 'ID do usuário', example: 2 }),
        name: z.string().openapi({ description: 'Nome do usuário', example: 'Maria Santos' }),
        email: z.string().openapi({ description: 'Email do usuário', example: 'maria@exemplo.com' }),
      }),
    })
    .openapi({
      ref: 'ParticipantResponse',
      description: 'Dados de um participante',
    });

  const messageResponseSchema = z
    .object({
      id: z.number().openapi({ description: 'ID da mensagem', example: 1 }),
      conversationId: z.number().openapi({ description: 'ID da conversa', example: 1 }),
      content: z.string().openapi({ description: 'Conteúdo da mensagem', example: 'Olá pessoal!' }),
      messageType: z.string().openapi({ description: 'Tipo da mensagem', example: 'text' }),
      createdAt: z.string().openapi({ description: 'Data de criação', example: '2024-01-01T00:00:00Z' }),
      readAt: z.string().nullable().openapi({ description: 'Data de leitura', example: null }),
      sender: z.object({
        id: z.number().openapi({ description: 'ID do remetente', example: 1 }),
        name: z.string().openapi({ description: 'Nome do remetente', example: 'João Silva' }),
        email: z.string().openapi({ description: 'Email do remetente', example: 'joao@exemplo.com' }),
      }),
    })
    .openapi({
      ref: 'MessageResponse',
      description: 'Dados de uma mensagem',
    });

  const messageListResponseSchema = z
    .object({
      message: z.string().openapi({ description: 'Mensagem de sucesso', example: 'Mensagens listadas com sucesso.' }),
      data: z.array(messageResponseSchema),
      pagination: z.object({
        page: z.number().openapi({ description: 'Página atual', example: 1 }),
        per_page: z.number().openapi({ description: 'Itens por página', example: 20 }),
        total: z.number().openapi({ description: 'Total de itens', example: 100 }),
        total_pages: z.number().openapi({ description: 'Total de páginas', example: 5 }),
      }),
    })
    .openapi({
      ref: 'MessageListResponse',
      description: 'Lista de mensagens com paginação',
    });

  const unreadCountResponseSchema = z
    .object({
      message: z.string().openapi({ description: 'Mensagem de sucesso', example: 'Contagem obtida com sucesso.' }),
      data: z.object({
        unreadCount: z.number().openapi({ description: 'Número de mensagens não lidas', example: 5 }),
      }),
    })
    .openapi({
      ref: 'UnreadCountResponse',
      description: 'Contagem de mensagens não lidas',
    });

  const document = createDocument({
    openapi: '3.0.0',
    info: {
      title: 'FreeTalk API',
      description: 'API completa para aplicação de chat em tempo real',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    paths: {
      '/api/v1/auth/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Login de usuário',
          description: 'Endpoint para autenticar um usuário existente',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: loginSchema.shape.body,
              },
            },
          },
          responses: {
            '200': {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: loginResponseSchema,
                },
              },
            },
            '400': {
              description: 'Dados inválidos',
            },
            '401': {
              description: 'Credenciais inválidas',
            },
          },
        },
      },
      '/api/v1/auth/register': {
        post: {
          tags: ['Autenticação'],
          summary: 'Registro de usuário',
          description: 'Endpoint para cadastrar um novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: registerSchema.shape.body,
              },
            },
          },
          responses: {
            '200': {
              description: 'Usuário criado com sucesso',
              content: {
                'application/json': {
                  schema: registerResponseSchema,
                },
              },
            },
            '400': {
              description: 'Dados inválidos ou usuário já existe',
            },
          },
        },
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Autenticação'],
          summary: 'Detalhes do usuário atual',
          description: 'Endpoint para obter informações do usuário autenticado',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            '200': {
              description: 'Usuário encontrado com sucesso',
              content: {
                'application/json': {
                  schema: meResponseSchema,
                },
              },
            },
            '401': {
              description: 'Não autorizado - Token ausente ou inválido',
            },
            '404': {
              description: 'Usuário não encontrado',
            },
          },
        },
      },
      
      '/api/v1/conversations': {
        get: {
          tags: ['Conversas'],
          summary: 'Listar conversas do usuário',
          description: 'Endpoint para listar todas as conversas do usuário autenticado com paginação',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Número da página',
            },
            {
              name: 'per_page',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Itens por página',
            },
            {
              name: 'search',
              in: 'query',
              schema: { type: 'string' },
              description: 'Termo de busca',
            },
          ],
          responses: {
            '200': {
              description: 'Conversas listadas com sucesso',
              content: {
                'application/json': {
                  schema: conversationListResponseSchema,
                },
              },
            },
            '401': { description: 'Não autorizado' },
          },
        },
        post: {
          tags: ['Conversas'],
          summary: 'Criar nova conversa',
          description: 'Endpoint para criar uma nova conversa',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: createConversationSchema.shape.body,
              },
            },
          },
          responses: {
            '201': {
              description: 'Conversa criada com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                    data: conversationResponseSchema,
                  }),
                },
              },
            },
            '400': { description: 'Dados inválidos' },
            '401': { description: 'Não autorizado' },
          },
        },
      },
      
      '/api/v1/conversations/{id}': {
        get: {
          tags: ['Conversas'],
          summary: 'Buscar conversa específica',
          description: 'Endpoint para buscar uma conversa específica por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
          ],
          responses: {
            '200': {
              description: 'Conversa encontrada com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                    data: conversationResponseSchema,
                  }),
                },
              },
            },
            '404': { description: 'Conversa não encontrada' },
            '401': { description: 'Não autorizado' },
          },
        },
        put: {
          tags: ['Conversas'],
          summary: 'Atualizar conversa',
          description: 'Endpoint para atualizar uma conversa existente',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: updateConversationSchema.shape.body,
              },
            },
          },
          responses: {
            '200': {
              description: 'Conversa atualizada com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                    data: conversationResponseSchema,
                  }),
                },
              },
            },
            '404': { description: 'Conversa não encontrada' },
            '401': { description: 'Não autorizado' },
          },
        },
        delete: {
          tags: ['Conversas'],
          summary: 'Deletar conversa',
          description: 'Endpoint para deletar uma conversa',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
          ],
          responses: {
            '200': {
              description: 'Conversa deletada com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                  }),
                },
              },
            },
            '404': { description: 'Conversa não encontrada' },
            '401': { description: 'Não autorizado' },
          },
        },
      },
      
      '/api/v1/conversations/{id}/participants': {
        get: {
          tags: ['Participantes'],
          summary: 'Listar participantes da conversa',
          description: 'Endpoint para listar todos os participantes de uma conversa',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
          ],
          responses: {
            '200': {
              description: 'Participantes listados com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                    data: z.array(participantResponseSchema),
                  }),
                },
              },
            },
            '404': { description: 'Conversa não encontrada' },
            '401': { description: 'Não autorizado' },
          },
        },
        post: {
          tags: ['Participantes'],
          summary: 'Adicionar participantes',
          description: 'Endpoint para adicionar múltiplos participantes a uma conversa',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: addParticipantsSchema.shape.body,
              },
            },
          },
          responses: {
            '201': {
              description: 'Participantes adicionados com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                    data: z.array(participantResponseSchema),
                  }),
                },
              },
            },
            '400': { description: 'Participantes já existem na conversa' },
            '404': { description: 'Conversa não encontrada' },
            '401': { description: 'Não autorizado' },
          },
        },
      },
      
      '/api/v1/conversations/{id}/participants/{userId}': {
        delete: {
          tags: ['Participantes'],
          summary: 'Remover participante',
          description: 'Endpoint para remover um participante específico da conversa',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
            {
              name: 'userId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do usuário a ser removido',
            },
          ],
          responses: {
            '200': {
              description: 'Participante removido com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                  }),
                },
              },
            },
            '404': { description: 'Conversa ou participante não encontrado' },
            '401': { description: 'Não autorizado' },
          },
        },
      },
      
      '/api/v1/conversations/{conversationId}/messages': {
        get: {
          tags: ['Mensagens'],
          summary: 'Listar mensagens da conversa',
          description: 'Endpoint para listar mensagens de uma conversa com paginação',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'conversationId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Número da página',
            },
            {
              name: 'per_page',
              in: 'query',
              schema: { type: 'integer', default: 20 },
              description: 'Itens por página',
            },
          ],
          responses: {
            '200': {
              description: 'Mensagens listadas com sucesso',
              content: {
                'application/json': {
                  schema: messageListResponseSchema,
                },
              },
            },
            '403': { description: 'Sem acesso à conversa' },
            '401': { description: 'Não autorizado' },
          },
        },
        post: {
          tags: ['Mensagens'],
          summary: 'Enviar mensagem',
          description: 'Endpoint para enviar uma nova mensagem na conversa',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'conversationId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: createMessageSchema.shape.body,
              },
            },
          },
          responses: {
            '201': {
              description: 'Mensagem criada com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                    data: messageResponseSchema,
                  }),
                },
              },
            },
            '403': { description: 'Sem acesso à conversa' },
            '401': { description: 'Não autorizado' },
          },
        },
      },
      
      '/api/v1/conversations/{conversationId}/messages/{messageId}': {
        get: {
          tags: ['Mensagens'],
          summary: 'Buscar mensagem específica',
          description: 'Endpoint para buscar uma mensagem específica',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'conversationId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
            {
              name: 'messageId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da mensagem',
            },
          ],
          responses: {
            '200': {
              description: 'Mensagem encontrada com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                    data: messageResponseSchema,
                  }),
                },
              },
            },
            '404': { description: 'Mensagem não encontrada' },
            '403': { description: 'Sem acesso à conversa' },
            '401': { description: 'Não autorizado' },
          },
        },
        put: {
          tags: ['Mensagens'],
          summary: 'Editar mensagem',
          description: 'Endpoint para editar uma mensagem existente (apenas pelo autor)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'conversationId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
            {
              name: 'messageId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da mensagem',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: updateMessageSchema.shape.body,
              },
            },
          },
          responses: {
            '200': {
              description: 'Mensagem atualizada com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                    data: messageResponseSchema,
                  }),
                },
              },
            },
            '403': { description: 'Sem permissão para editar esta mensagem' },
            '404': { description: 'Mensagem não encontrada' },
            '401': { description: 'Não autorizado' },
          },
        },
        delete: {
          tags: ['Mensagens'],
          summary: 'Deletar mensagem',
          description: 'Endpoint para deletar uma mensagem (autor ou criador da conversa)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'conversationId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
            {
              name: 'messageId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da mensagem',
            },
          ],
          responses: {
            '200': {
              description: 'Mensagem deletada com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                  }),
                },
              },
            },
            '403': { description: 'Sem permissão para deletar esta mensagem' },
            '404': { description: 'Mensagem não encontrada' },
            '401': { description: 'Não autorizado' },
          },
        },
      },
      
      '/api/v1/conversations/{conversationId}/messages/mark-as-read': {
        post: {
          tags: ['Mensagens'],
          summary: 'Marcar mensagens como lidas',
          description: 'Endpoint para marcar múltiplas mensagens como lidas',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'conversationId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: markAsReadSchema.shape.body,
              },
            },
          },
          responses: {
            '200': {
              description: 'Mensagens marcadas como lidas com sucesso',
              content: {
                'application/json': {
                  schema: z.object({
                    message: z.string(),
                  }),
                },
              },
            },
            '400': { description: 'Mensagem não pertence à conversa' },
            '403': { description: 'Sem acesso à conversa' },
            '401': { description: 'Não autorizado' },
          },
        },
      },
      
      '/api/v1/conversations/{conversationId}/messages/unread-count': {
        get: {
          tags: ['Mensagens'],
          summary: 'Contar mensagens não lidas',
          description: 'Endpoint para obter a contagem de mensagens não lidas da conversa',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'conversationId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da conversa',
            },
          ],
          responses: {
            '200': {
              description: 'Contagem obtida com sucesso',
              content: {
                'application/json': {
                  schema: unreadCountResponseSchema,
                },
              },
            },
            '403': { description: 'Sem acesso à conversa' },
            '401': { description: 'Não autorizado' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  });

  const openapiPath = path.resolve(process.cwd(), 'src/docs/openapi.json');
  fs.writeFileSync(openapiPath, JSON.stringify(document, null, 2));

  return document;
};
