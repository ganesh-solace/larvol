import { CoreAuthModule } from './core-auth.module';

describe('CoreAuthModule', () => {
  let coreAuthModule: CoreAuthModule;

  beforeEach(() => {
    coreAuthModule = new CoreAuthModule();
  });

  it('should create an instance', () => {
    expect(coreAuthModule).toBeTruthy();
  });
});
