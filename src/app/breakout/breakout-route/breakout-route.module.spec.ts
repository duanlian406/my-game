import { BreakoutRouteModule } from './breakout-route.module';

describe('BreakoutRouteModule', () => {
  let breakoutRouteModule: BreakoutRouteModule;

  beforeEach(() => {
    breakoutRouteModule = new BreakoutRouteModule();
  });

  it('should create an instance', () => {
    expect(breakoutRouteModule).toBeTruthy();
  });
});
