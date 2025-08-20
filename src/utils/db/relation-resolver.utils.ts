import { EntityOrId, Repository, ResourceTransformer, RelationConfig } from '@/types/db/relation-resolver.types';

export async function resolveRelation<T>(
  value: EntityOrId<T>,
  repository: Repository<T>,
  transformToResource: ResourceTransformer<T>
): Promise<any | null> {
  if (!value) return null;
  
  if (typeof value === 'number') {
    const entity = await repository.findById(value);
    
    return entity ? transformToResource(entity) : null;
  }

  return transformToResource(value as T);
}

export async function resolveRelations<T extends Record<string, any>>(
  entity: T,
  relations: RelationConfig<any>[]
): Promise<T> {
  const resolvedEntity = { ...entity } as T;
  
  const resolvedRelations = await Promise.all(
    relations.map(async (relation) => {
      const value = (entity as any)[relation.field];
      const resolved = await resolveRelation(
        value,
        relation.repository,
        relation.transformer
      );
      return { field: relation.field, value: resolved };
    })
  );
  
  resolvedRelations.forEach(({ field, value }) => {
    (resolvedEntity as any)[field] = value;
  });
  
  return resolvedEntity;
}

export async function resolveRelationArray<T>(
  values: EntityOrId<T>[] | null,
  repository: Repository<T>,
  transformToResource: ResourceTransformer<T>
): Promise<any[]> {
  if (!values || values.length === 0) return [];
  
  const resolvedEntities = await Promise.all(
    values.map(value => resolveRelation(value, repository, transformToResource))
  );
  
  return resolvedEntities.filter(Boolean);
}