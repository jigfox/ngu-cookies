import { CookieOptions } from './browser-cookies-handler.service';

export abstract class CookieHandlerService {
  protected cookies: Map<string, string>;
  // https://tools.ietf.org/html/rfc6265#section-4.1.1
  protected cookieValueRegex = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]*$/;
  // https://tools.ietf.org/html/rfc2616#section-2.2
  protected cookieKeyRegex = /^[\x21\x23-\x27\x2A\x2B\x2D\x2E\x30-\x39\x41-\x5A\x5E-\x7A\x7C\x7E]*$/;

  writeCookie(key: string, value: string, options: CookieOptions): void {
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
    if (this.readRawCookie().split(';').length >= 50) {
      throw new Error('Max cookies count reached');
    }
    this.writeRawCookie(key, value, options);
    this.cookies.set(key, value);
  }
  readCookie(key: string, skipUriDecoding = false) {
    const value = this.cookies.get(key);
    return value && (skipUriDecoding ? value : decodeURIComponent(value));
  }
  deleteCookie(key: string): void {
    this.writeCookie(key, '', { expires: new Date(0) });
    this.cookies.delete(key);
  }
  protected getCookies(): Map<string, string> {
    return this.readRawCookie()
      .split(/; */)
      .map(pair => pair.split('=').map(a => a.trim()))
      .reduce((cookiesMap, [key, value]) => {
        cookiesMap.set(key, value);
        return cookiesMap;
      }, new Map<string, string>());
  }
  protected getCookieLength(key: string, value: string): number {
    return key.length + value.length + 1;
  }

  protected abstract rawCookieLength(): number;
  protected abstract readRawCookie(): string;
  protected abstract writeRawCookie(
    key: string,
    value: string,
    options: CookieOptions,
  ): void;
}
