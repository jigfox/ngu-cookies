import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CookiesService } from './cookies.service';
import { BackendCookieHandlerService } from './backend-cookies-handler.service';
import { CookieHandlerService } from './cookie-handler.service';

@NgModule({})
export class NguCookiesBackendModule {
  constructor(@Optional() @SkipSelf() parentModule?: NguCookiesBackendModule) {
    if (parentModule) {
      throw new Error(
        'NguCookiesModule is already loaded. Import it in the AppModule only',
      );
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NguCookiesBackendModule,
      providers: [
        {
          provide: CookieHandlerService,
          useClass: BackendCookieHandlerService,
        },
      ],
    };
  }
}
