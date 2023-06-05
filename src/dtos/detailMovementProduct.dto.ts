import { IsNumber, IsObject } from 'class-validator';

export class CreateDetailMovementProductDto {
  @IsObject()
  public movementProduct: object;

  @IsObject()
  public product: object;

  @IsNumber()
  public quantity: number;
}
