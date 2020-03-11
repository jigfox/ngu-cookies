import { Injectable, Inject } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';

import { CookieHandlerService } from './cookie-handler.service';
import { CookieOptions } from './browser-cookies-handler.service';

@Injectable()
export class BackendCookieHandlerService extends CookieHandlerService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @Inject(RESPONSE) private res: Response,
  ) {
    super();
  }

  protected readRawCookie(): string {
    return this.req.headers.cookie || '';
  }

  protected writeRawCookie(
    key: string,
    value: string,
    options: CookieOptions,
  ): void {
    this.res.cookie(key, value, options);
  }
}
