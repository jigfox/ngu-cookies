import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CookiesService } from './cookies.service';
import { BrowserCookieHandlerService } from './browser-cookies-handler.service';
import { CookieHandlerService } from './cookie-handler.service';

@NgModule({})
export class NguCookiesModule {
  constructor(@Optional() @SkipSelf() parentModule?: NguCookiesModule) {
    if (parentModule) {
      throw new Error(
        'NguCookiesModule is already loaded. Import it in the AppModule only',
      );
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NguCookiesModule,
      providers: [
        CookiesService,
        {
          provide: CookieHandlerService,
          useClass: BrowserCookieHandlerService,
        },
      ],
    };
  }
}
