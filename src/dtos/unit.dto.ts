import { IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  public designation: string;

  @IsString()
  public code: string;
}
