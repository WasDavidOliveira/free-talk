import { z } from 'zod';

export const paginationSchema = z.object({
  query: z
    .object({
      page: z
        .coerce.number()
        .openapi({
          description: 'Número da página',
          example: 1,
        }).optional(),
      per_page: z
        .coerce.number()
        .openapi({
          description: 'Limite de itens por página',
          example: 10,
        }).optional(),
      offset: z
        .coerce.number()
        .openapi({
          description: 'Offset de itens',
          example: 0,
        }).optional(),
      search: z
        .string({ required_error: 'Pesquisa é obrigatório' })
        .default('')
        .openapi({
          description: 'Pesquisa',
          example: 'Pesquisa',
        }).optional(),
      order_by: z
        .string()
        .default('created_at')
        .openapi({
          description: 'Campo para ordenação (padrão: created_at)',
          example: 'created_at',
        }),
      order_direction: z
        .enum(['asc', 'desc'])
        .default('desc')
        .openapi({
          description: 'Direção da ordenação (asc ou desc, padrão: desc)',
          example: 'desc',
        }),
    })
    .openapi({
      ref: 'PaginationInput',
      description: 'Parâmetros de paginação',
    }),
});

export type PaginationInput = z.infer<typeof paginationSchema>['query'];
