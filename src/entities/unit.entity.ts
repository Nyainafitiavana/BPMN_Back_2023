import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Unit } from '@/interfaces/unit.interface';
import { ProductEntity } from './product.entity';

@Entity()
export class UnitEntity extends BaseEntity implements Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  designation: string;

  @Column()
  @IsNotEmpty()
  code: string;

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.unit)
  public product: ProductEntity[];
}
