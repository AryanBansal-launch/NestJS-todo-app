import { validate } from "class-validator";
import { UpdateTodoDto } from "./update-todo.dto";

describe('UpdateTodoDto', () => {
    it('should validate the completed property', async () => {
        const dto = new UpdateTodoDto();
        dto.completed = true;

        const errors = validate(dto);
        expect((await errors).length).toBe(0);
    });

    it('should not throw an error if completed is not provided', async () => {
        const dto = new UpdateTodoDto();

        const errors = validate(dto);
        expect((await errors).length).toBe(0);
    });
});