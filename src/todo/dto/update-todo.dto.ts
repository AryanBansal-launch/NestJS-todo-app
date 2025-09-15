import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTodoDto {
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
