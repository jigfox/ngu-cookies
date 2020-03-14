import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BackendCookieHandlerService } from './backend-cookies-handler.service';
import { CookieHandlerService } from './cookie-handler.service';
import { NguCookiesModule } from './ngu-cookies.module';

@NgModule({
  providers: [
    { provide: CookieHandlerService, useClass: BackendCookieHandlerService },
  ],
})
export class NguCookiesBackendModule {
  constructor(
    @Optional() @SkipSelf() parentModule?: NguCookiesBackendModule,
    @Optional() mainModule?: NguCookiesModule,
  ) {
    if (parentModule) {
      throw new Error(
        'NguCookiesBackendModule is already loaded. Import it in the AppModule only',
      );
    }
    if (!mainModule) {
      throw new Error(
        'NguCookiesBackendModule requires NguCookiesModule to be imported before',
      );
    }
  }
}
