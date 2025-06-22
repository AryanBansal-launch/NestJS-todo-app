import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
