import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export enum SameSite {
  Lax = 'lax',
  Strict = 'strict',
}

interface CookieOptions {
  expires?: Date;
  domain?: string;
  maxAge?: number;
  path?: string;
  secure?: boolean;
  samesite?: SameSite;
}

@Injectable()
export class CookiesService {
  protected cookies = new Map<string, string>();
  // https://tools.ietf.org/html/rfc6265#section-4.1.1
  protected cookieValueRegex = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]*$/;
  // https://tools.ietf.org/html/rfc2616#section-2.2
  protected cookieKeyRegex = /^[\x21\x23-\x27\x2A\x2B\x2D\x2E\x30-\x39\x41-\x5A\x5E-\x7A\x7C\x7E]*$/;

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.parseCookies();
  }

  get(key: string): string {
    return this.cookies.get(key);
  }

  put(key: string, value: string, options: CookieOptions = {}): void {
    if (!this.cookieValueRegex.test(value)) {
      throw Error(`value '${value}' contains invalid characters`);
    }
    if (!this.cookieKeyRegex.test(key)) {
      throw Error(`key '${key}' contains invalid characters`);
    }
    this.cookies.set(key, value);
    const cookieEntries = [`${key}=${value}`];
    if (options.expires) {
      cookieEntries.push(`expires=${options.expires.toUTCString()}`);
    }
    if (options.domain) {
      cookieEntries.push(`domain=${options.domain}`);
    }
    if (options.maxAge) {
      cookieEntries.push(`max-age=${options.maxAge}`);
    }
    if (options.path) {
      cookieEntries.push(`path=${options.path}`);
    }
    if (options.secure) {
      cookieEntries.push('secure');
    }
    if (options.samesite) {
      cookieEntries.push(`samesite=${options.samesite}`);
    }
    this.doc.cookie = cookieEntries.join('; ');
  }

  delete(key: string): void {
    this.cookies.delete(key);
    this.put(key, '', { expires: new Date(0) });
  }

  protected parseCookies(): void {
    (this.doc.cookie ?? '')
      .split(/; */)
      .map(pair => pair.split('=').map(a => a.trim()))
      .forEach(([key, value]) => {
        this.cookies.set(key, value);
      });
  }
}
