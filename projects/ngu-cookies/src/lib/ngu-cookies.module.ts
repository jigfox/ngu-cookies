import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  InjectionToken,
} from '@angular/core';
import { CookiesService } from './cookies.service';
import {
  BrowserCookieHandlerService,
  CookieOptions,
} from './browser-cookies-handler.service';
import { CookieHandlerService } from './cookie-handler.service';

export const CookieConfig = new InjectionToken<CookieOptions>('CookieOptions');

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
