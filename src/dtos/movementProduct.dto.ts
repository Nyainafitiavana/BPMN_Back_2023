import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateMovementProductDto {
  @IsBoolean()
  public isEnter: boolean;

  @IsObject()
  public editor: object;

  @IsNumber()
  public priceWalk: number;

  @IsString()
  public plannedDate: string;

  @IsString()
  public status: string;
}
