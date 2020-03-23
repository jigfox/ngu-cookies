import { NgModule, Optional, SkipSelf } from '@angular/core';

import { NguCookiesModule } from './ngu-cookies.module';
import { BackendService } from './cookies.service';
import { ServerBackendService } from './backends/server-backend.service';

@NgModule({
  providers: [{ provide: BackendService, useClass: ServerBackendService }],
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
