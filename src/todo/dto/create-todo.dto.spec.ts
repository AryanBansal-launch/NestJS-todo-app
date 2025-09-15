import { validate } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

describe('CreateTodoDto', () => {
  it('should validate the title and completed properties', async () => {
    const dto = new CreateTodoDto();
    dto.title = 'Test Todo';
    dto.completed = true;

    const errors = validate(dto);
    expect((await errors).length).toBe(0);
  });

  it('should throw an error if title is empty', async () => {
    const dto = new CreateTodoDto();
    dto.title = '';
    dto.completed = true;

    const errors = validate(dto);
    expect((await errors).length).toBeGreaterThan(0);
  });

  it('should throw an error if title is less than 5 characters', async () => {
    const dto = new CreateTodoDto();
    dto.title = '1234';
    dto.completed = true;

    const errors = validate(dto);
    expect((await errors).length).toBeGreaterThan(0);
  });

  it('should throw an error if title is greater than 100 characters', async () => {
    const dto = new CreateTodoDto();
    dto.title = 'a'.repeat(101);
    dto.completed = true;

    const errors = validate(dto);
    expect((await errors).length).toBeGreaterThan(0);
  });
});
