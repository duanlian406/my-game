import { SnakeModule } from './snake.module';

describe('SnakeModule', () => {
  let snakeModule: SnakeModule;

  beforeEach(() => {
    snakeModule = new SnakeModule();
  });

  it('should create an instance', () => {
    expect(snakeModule).toBeTruthy();
  });
});
