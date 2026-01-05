import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @Type(() => Number)
  price: number;
}
