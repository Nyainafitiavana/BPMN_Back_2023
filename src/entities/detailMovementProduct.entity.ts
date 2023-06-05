import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';
import { DetailMovementProduct } from '@/interfaces/detailMovementProduct.interface';
import { MovementProductEntity } from './movementProduct.entity';

@Entity()
export class DetailMovementProductEntity extends BaseEntity implements DetailMovementProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MovementProductEntity, (movementProduct: MovementProductEntity) => movementProduct.detail, {
    onDelete: 'CASCADE',
  })
  public movementProduct: MovementProductEntity;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.detail, {
    onDelete: 'CASCADE',
  })
  public product: ProductEntity;

  @Column()
  @IsNotEmpty()
  quantity: number;
}
