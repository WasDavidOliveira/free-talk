import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
extendZodWithOpenApi(z);

export const createConversationSchema = z.object({
  body: z
    .object({
      title: z
        .string({ required_error: 'Título é obrigatório' })
        .min(1, 'Título é obrigatório')
        .openapi({
          description: 'Título da conversa',
          example: 'Conversa de teste',
        }),
    })
    .openapi({
      ref: 'CreateConversationInput',
      description: 'Dados para criação de uma nova conversa',
    }),
});

export const updateConversationSchema = z.object({
  body: z
    .object({
      title: z
        .string({ required_error: 'Título é obrigatório' })
        .min(1, 'Título é obrigatório')
        .openapi({
          description: 'Título da conversa',
          example: 'Conversa de teste',
        }),
    })
    .openapi({
      ref: 'UpdateConversationInput',
      description: 'Dados para atualização de uma conversa',
    }),
});

export const parametroConversationSchema = z.object({
  params: z.object({
    id: z.coerce.number({ required_error: 'ID é obrigatório' }).openapi({
      description: 'ID da conversa',
      example: 1,
    }),
  }),
});

export const addParticipantsSchema = z.object({
  body: z
    .object({
      userIds: z
        .array(z.number({ required_error: 'ID do usuário é obrigatório' }))
        .min(1, 'Pelo menos um usuário deve ser informado')
        .openapi({
          description: 'IDs dos usuários para adicionar como participantes',
          example: [1, 2, 3],
        }),
    })
    .openapi({
      ref: 'AddParticipantsInput',
      description: 'Dados para adicionar participantes a uma conversa',
    }),
});

export const removeParticipantSchema = z.object({
  params: z.object({
    id: z.coerce.number({ required_error: 'ID da conversa é obrigatório' }).openapi({
      description: 'ID da conversa',
      example: 1,
    }),
    userId: z.coerce.number({ required_error: 'ID do usuário é obrigatório' }).openapi({
      description: 'ID do usuário para remover',
      example: 1,
    }),
  }),
});

export type CreateConversationInput = z.infer<
  typeof createConversationSchema
>['body'];

export type UpdateConversationInput = z.infer<
  typeof updateConversationSchema
>['body'];

export type ParametroConversationInput = z.infer<
  typeof parametroConversationSchema
>['params'];

export type AddParticipantsInput = z.infer<
  typeof addParticipantsSchema
>['body'];

export type RemoveParticipantInput = z.infer<
  typeof removeParticipantSchema
>['params'];
