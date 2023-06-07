import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { MovementProduct } from '@/interfaces/movementProduct.interface';
import { UserEntity } from './users.entity';
import { DetailMovementProductEntity } from './detailMovementProduct.entity';

@Entity()
export class MovementProductEntity extends BaseEntity implements MovementProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  public isEnter: boolean;

  @ManyToOne(() => UserEntity, (editor: UserEntity) => editor.movementProduct, {
    onDelete: 'CASCADE',
  })
  public editor: UserEntity;

  @Column()
  @IsNotEmpty()
  public status: number;

  @Column()
  @IsNotEmpty()
  public plannedDate: string;

  @OneToMany(() => DetailMovementProductEntity, (detail: DetailMovementProductEntity) => detail.movementProduct)
  public detail: DetailMovementProductEntity[];

  @Column()
  @IsNotEmpty()
  date: string;
}
