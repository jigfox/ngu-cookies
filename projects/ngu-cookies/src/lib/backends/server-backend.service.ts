import { Injectable, Inject } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';

import { CookieBackend, CookieOptions } from '../interfaces';

@Injectable()
export class ServerBackendService implements CookieBackend {
  constructor(
    @Inject(REQUEST) private req: Request,
    @Inject(RESPONSE) private res: Response,
  ) {}

  readRawCookie(): string {
    return this.req.headers.cookie || '';
  }

  writeRawCookie(key: string, value: string, options: CookieOptions): void {
    this.res.cookie(key, value, options);
  }
}
