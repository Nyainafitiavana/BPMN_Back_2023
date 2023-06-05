import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '@/interfaces/product.interface';
import { CategoryEntity } from './category.entity';
import { UnitEntity } from './unit.entity';

@Entity()
export class ProductEntity extends BaseEntity implements Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  designation: string;

  @ManyToOne(() => CategoryEntity, (category: CategoryEntity) => category.product, {
    onDelete: 'CASCADE',
  })
  public category: CategoryEntity;

  @Column()
  @IsNotEmpty()
  limitStock: number;

  @ManyToOne(() => UnitEntity, (unit: UnitEntity) => unit.product, {
    onDelete: 'CASCADE',
  })
  public unit: UnitEntity;
}
