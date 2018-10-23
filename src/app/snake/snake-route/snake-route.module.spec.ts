import { SnakeRouteModule } from './snake-route.module';

describe('SnakeRouteModule', () => {
  let snakeRouteModule: SnakeRouteModule;

  beforeEach(() => {
    snakeRouteModule = new SnakeRouteModule();
  });

  it('should create an instance', () => {
    expect(snakeRouteModule).toBeTruthy();
  });
});
