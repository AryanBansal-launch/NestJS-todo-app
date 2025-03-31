import { Schema } from "@nestjs/mongoose";
import { Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Todo {
    @Prop({ required: true })
    title: string;

    @Prop({ default: false })
    completed: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);