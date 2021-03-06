import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';

import { CookieOptions, CookieBackend } from './interfaces';

export const CookieConfig = new InjectionToken<CookieOptions>('CookieOptions');
export const BackendService = new InjectionToken<CookieBackend>(
  'CookieBackend',
);

@Injectable()
export class CookiesService {
  private defaultConfig: CookieOptions = {};
  private cookies: Map<string, string>;
  // https://tools.ietf.org/html/rfc6265#section-4.1.1
  private cookieValueRegex = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]*$/;
  // https://tools.ietf.org/html/rfc2616#section-2.2
  private cookieKeyRegex = /^[\x21\x23-\x27\x2A\x2B\x2D\x2E\x30-\x39\x41-\x5A\x5E-\x7A\x7C\x7E]*$/;

  constructor(
    @Inject(BackendService) private cookieBackend: CookieBackend,
    @Inject(CookieConfig) @Optional() defaultConfig: CookieOptions,
  ) {
    this.defaultConfig = defaultConfig ?? this.defaultConfig;
    this.cookies = this.getCookies();
  }

  get(key: string, skipUriDecoding = false): string {
    const value = this.cookies.get(key);
    return value && (skipUriDecoding ? value : decodeURIComponent(value));
  }

  put(key: string, value: string, options: CookieOptions = {}): void {
    if (!options.skipUriEncoding) {
      value = encodeURIComponent(value);
    }
    if (!this.cookieValueRegex.test(value)) {
      throw Error(`value '${value}' contains invalid characters`);
    }
    if (!this.cookieKeyRegex.test(key)) {
      throw Error(`key '${key}' contains invalid characters`);
    }
    // http://browsercookielimits.squawky.net/
    if (this.rawCookieLength() + 1 + this.getCookieLength(key, value) > 4093) {
      throw new Error('Max cookie size reached');
    }
    if (this.cookies.size >= 50) {
      throw new Error('Max cookies count reached');
    }
    this.cookieBackend.writeRawCookie(key, value, {
      ...this.defaultConfig,
      ...options,
    });
    this.cookies.set(key, value);
  }

  delete(key: string, options: CookieOptions = {}): void {
    const deleteOptions = {
      ...this.defaultConfig,
      ...options,
      expires: new Date(0),
    };
    delete deleteOptions.maxAge;
    this.cookieBackend.writeRawCookie(key, '', deleteOptions);
    this.cookies.delete(key);
  }

  private getCookies(): Map<string, string> {
    return this.cookieBackend
      .readRawCookie()
      .split(/; */)
      .filter(c => c)
      .map(pair => pair.split('=').map(a => a.trim()))
      .reduce((cookiesMap, [key, value]) => {
        cookiesMap.set(key, value);
        return cookiesMap;
      }, new Map<string, string>());
  }

  private getCookieLength(key: string, value: string): number {
    return key.length + value.length + 1;
  }

  private rawCookieLength(): number {
    return Array.from(this.cookies.entries()).reduce((sum, [key, value]) => {
      return sum + this.getCookieLength(key, value);
    }, 0);
  }
}
