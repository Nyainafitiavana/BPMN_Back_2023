import { IsNumber, IsObject, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public designation: string;

  @IsObject()
  public category: object;

  @IsNumber()
  public limitStock: number;

  @IsObject()
  public unit: object;
}
