import { z } from 'zod';

export const paginationSchema = z.object({
  query: z
    .object({
      page: z
        .string()
        .transform((val) => parseInt(val))
        .openapi({
          description: 'Número da página',
          example: 1,
        }).optional(),
      per_page: z
        .string()
        .transform((val) => parseInt(val))
        .openapi({
          description: 'Limite de itens por página',
          example: 10,
        }).optional(),
      offset: z
        .string()
        .transform((val) => parseInt(val))
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
        .string({ required_error: 'Ordenação é obrigatório' })
        .default('created_at')
        .openapi({
          description: 'Ordenação',
          example: 'created_at',
        }).optional(),
    })
    .openapi({
      ref: 'PaginationInput',
      description: 'Parâmetros de paginação',
    }),
});

export type PaginationInput = z.infer<typeof paginationSchema>['query'];
