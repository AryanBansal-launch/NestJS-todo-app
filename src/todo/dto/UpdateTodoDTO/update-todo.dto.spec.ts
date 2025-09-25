import { UpdateTodoDto } from './update-todo.dto';
import { validate } from 'class-validator';

describe('UpdateTodoDto', () => {
  it('should validate the completed field', async () => {
    const dto = new UpdateTodoDto();
    dto.completed = true;
    const errors = validate(dto);
    expect((await errors).length).toBe(0);
  });
});