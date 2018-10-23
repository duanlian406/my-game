import { AppRouteModule } from './app-route.module';

describe('AppRouteModule', () => {
  let appRouteModule: AppRouteModule;

  beforeEach(() => {
    appRouteModule = new AppRouteModule();
  });

  it('should create an instance', () => {
    expect(appRouteModule).toBeTruthy();
  });
});
