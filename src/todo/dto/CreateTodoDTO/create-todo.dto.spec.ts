import { CreateTodoDto } from './create-todo.dto';
import { validate } from 'class-validator';

describe('CreateTodoDto', () => {
  it('should validate the title and completed fields', async () => {
    const dto = new CreateTodoDto();
    dto.title = 'test';
    dto.completed = true;
    const errors = validate(dto);
    expect((await errors).length).toBe(0);
  });
  it('should throw an error if title field is empty', async () => {
    const dto = new CreateTodoDto();
    dto.title = '';
    dto.completed = true;
    const errors = validate(dto);
    expect((await errors).length).not.toBe(0);
  });
});
