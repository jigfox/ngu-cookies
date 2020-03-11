import { Injectable } from '@angular/core';
import { CookieOptions } from './browser-cookies-handler.service';
import { CookieHandlerService } from './cookie-handler.service';

@Injectable()
export class CookiesService {
  constructor(private cookieHandler: CookieHandlerService) {}

  get(key: string, skipUriDecoding = false): string {
    return this.cookieHandler.readCookie(key, skipUriDecoding);
  }

  put(key: string, value: string, options: CookieOptions = {}): void {
    this.cookieHandler.writeCookie(key, value, options);
  }

  delete(key: string, options: CookieOptions = {}): void {
    this.cookieHandler.deleteCookie(key, options);
  }
}
