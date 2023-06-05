import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Category } from '@/interfaces/category.interface';
import { ProductEntity } from './product.entity';

@Entity()
export class CategoryEntity extends BaseEntity implements Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  designation: string;

  @Column()
  @IsNotEmpty()
  code: string;

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.category)
  public product: ProductEntity[];
}
