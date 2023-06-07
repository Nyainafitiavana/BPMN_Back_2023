import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateMovementProductDto {
  @IsBoolean()
  public isEnter: boolean;

  @IsObject()
  public editor: object;

  @IsString()
  public plannedDate: string;

  @IsNumber()
  public status: number;

  @IsString()
  public date: string;
}
