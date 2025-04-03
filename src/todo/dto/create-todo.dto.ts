import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    title: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean = false;
}