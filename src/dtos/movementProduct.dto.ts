import { IsBoolean, IsObject, IsString } from 'class-validator';

export class CreateMovementProductDto {
  @IsBoolean()
  public isEnter: boolean;

  @IsObject()
  public editor: object;

  @IsString()
  public plannedDate: string;

  @IsString()
  public status: string;
}
