import { IsNotEmpty, IsString, IsBoolean ,IsOptional} from 'class-validator';

//DTO for create Todo
export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean = false;
}
