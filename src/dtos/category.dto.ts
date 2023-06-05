import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  public designation: string;

  @IsString()
  public code: string;
}
