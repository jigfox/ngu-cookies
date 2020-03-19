import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CookiesService, CookieConfig } from './cookies.service';
import {
  BrowserCookieHandlerService,
  CookieOptions,
} from './browser-cookies-handler.service';
import { CookieHandlerService } from './cookie-handler.service';

@NgModule({
  providers: [
    CookiesService,
    { provide: CookieHandlerService, useClass: BrowserCookieHandlerService },
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
          provide: CookieHandlerService,
          useClass: BrowserCookieHandlerService,
        },
      ],
    };
  }
}
