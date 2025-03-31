import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean = false;
}