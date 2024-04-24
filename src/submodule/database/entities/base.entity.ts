import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class BaseEntity {
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;
}

abstract class IntIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}

abstract class UUIDIdentifiableEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

abstract class BigintIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
}

export { BigintIdEntity, IntIdEntity, UUIDIdentifiableEntity };
