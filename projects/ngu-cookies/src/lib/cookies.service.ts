import { Injectable, Optional } from '@angular/core';
import { CookieOptions } from './browser-cookies-handler.service';
import { CookieHandlerService } from './cookie-handler.service';

@Injectable()
export class CookiesService {
  private defaultConfig: CookieOptions = {};

  constructor(
    private cookieHandler: CookieHandlerService,
    @Optional() defaultConfig: CookieOptions,
  ) {
    this.defaultConfig = defaultConfig ?? this.defaultConfig;
  }

  get(key: string, skipUriDecoding = false): string {
    return this.cookieHandler.readCookie(key, skipUriDecoding);
  }

  put(key: string, value: string, options: CookieOptions = {}): void {
    this.cookieHandler.writeCookie(key, value, {
      ...this.defaultConfig,
      ...options,
    });
  }

  delete(key: string, options: CookieOptions = {}): void {
    this.cookieHandler.deleteCookie(key, {
      ...this.defaultConfig,
      ...options,
    });
  }
}
