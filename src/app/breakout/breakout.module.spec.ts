import { BreakoutModule } from './breakout.module';

describe('BreakoutModule', () => {
  let breakoutModule: BreakoutModule;

  beforeEach(() => {
    breakoutModule = new BreakoutModule();
  });

  it('should create an instance', () => {
    expect(breakoutModule).toBeTruthy();
  });
});
