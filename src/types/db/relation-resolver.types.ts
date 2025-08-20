export type EntityId = number;
export type EntityData<T> = T;
export type EntityOrId<T> = EntityData<T> | EntityId | null;

export interface Repository<T> {
  findById: (id: EntityId) => Promise<T | null>;
}

export interface ResourceTransformer<T> {
  (entity: T): any;
}

export interface RelationConfig<T> {
  field: string;
  repository: Repository<T>;
  transformer: ResourceTransformer<T>;
}
