import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { MessageType } from '@/enums/v1/modules/chat/message-types.enum';

extendZodWithOpenApi(z);

export const createMessageSchema = z.object({
  body: z
    .object({
      content: z
        .string()
        .min(1, 'Conteúdo da mensagem é obrigatório')
        .max(5000, 'Conteúdo da mensagem deve ter no máximo 5000 caracteres')
        .openapi({
          description: 'Conteúdo da mensagem',
          example: 'Olá, como você está?',
        }),
      messageType: z
        .enum([MessageType.TEXT, MessageType.FILE, MessageType.MIXED])
        .optional()
        .default(MessageType.TEXT)
        .openapi({
          description: 'Tipo da mensagem',
          example: MessageType.TEXT,
        }),
    })
    .openapi({
      ref: 'CreateMessageInput',
      description: 'Dados para criação de uma nova mensagem',
    }),
});

export const updateMessageSchema = z.object({
  body: z
    .object({
      content: z
        .string()
        .min(1, 'Conteúdo da mensagem é obrigatório')
        .max(5000, 'Conteúdo da mensagem deve ter no máximo 5000 caracteres')
        .openapi({
          description: 'Conteúdo da mensagem',
          example: 'Mensagem editada',
        }),
    })
    .openapi({
      ref: 'UpdateMessageInput',
      description: 'Dados para atualização de uma mensagem',
    }),
});

export const messageParamsSchema = z.object({
  params: z.object({
    conversationId: z.coerce.number({ required_error: 'ID da conversa é obrigatório' }).openapi({
      description: 'ID da conversa',
      example: 1,
    }),
    messageId: z.coerce.number({ required_error: 'ID da mensagem é obrigatório' }).openapi({
      description: 'ID da mensagem',
      example: 1,
    }),
  }),
});

export const conversationParamsSchema = z.object({
  params: z.object({
    conversationId: z.coerce.number({ required_error: 'ID da conversa é obrigatório' }).openapi({
      description: 'ID da conversa',
      example: 1,
    }),
  }),
});

export const markAsReadSchema = z.object({
  body: z
    .object({
      messageIds: z
        .array(z.number({ required_error: 'ID da mensagem é obrigatório' }))
        .min(1, 'Pelo menos uma mensagem deve ser informada')
        .openapi({
          description: 'IDs das mensagens para marcar como lidas',
          example: [1, 2, 3],
        }),
    })
    .openapi({
      ref: 'MarkAsReadInput',
      description: 'Dados para marcar mensagens como lidas',
    }),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>['body'];
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>['body'];
export type MessageParamsInput = z.infer<typeof messageParamsSchema>['params'];
export type ConversationParamsInput = z.infer<typeof conversationParamsSchema>['params'];
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>['body'];
