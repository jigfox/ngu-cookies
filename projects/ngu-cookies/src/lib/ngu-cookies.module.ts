import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  CookiesService,
  CookieConfig,
  BackendService,
} from './cookies.service';
import { BrowserBackendService } from './backends/browser-backend.service';
import { CookieOptions } from './interfaces';

@NgModule({
  providers: [
    CookiesService,
    { provide: BackendService, useClass: BrowserBackendService },
  ],
})
export class NguCookiesModule {
  constructor(@Optional() @SkipSelf() parentModule?: NguCookiesModule) {
    if (parentModule) {
      throw new Error(
        'NguCookiesModule is already loaded. Import it in the AppModule only',
      );
    }
  }

  static withConfig(config: CookieOptions): ModuleWithProviders {
    return {
      ngModule: NguCookiesModule,
      providers: [
        { provide: CookieConfig, useValue: config },
        CookiesService,
        {
          provide: BackendService,
          useClass: BrowserBackendService,
        },
      ],
    };
  }
}
