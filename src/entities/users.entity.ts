import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { MovementProductEntity } from './movementProduct.entity';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsNotEmpty()
  address: string;

  @Column()
  @IsNotEmpty()
  phone: string;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  isManager: boolean;

  @Column()
  @IsNotEmpty()
  isActif: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => MovementProductEntity, (movementProduct: MovementProductEntity) => movementProduct.editor)
  public movementProduct: MovementProductEntity[];
}
