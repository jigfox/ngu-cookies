import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieHandlerService } from './cookie-handler.service';

export enum SameSite {
  Lax = 'lax',
  Strict = 'strict',
}

export interface CookieOptions {
  expires?: Date;
  domain?: string;
  maxAge?: number;
  path?: string;
  secure?: boolean;
  samesite?: SameSite;
  skipUriEncoding?: boolean;
}

@Injectable()
export class BrowserCookieHandlerService extends CookieHandlerService {
  constructor(@Inject(DOCUMENT) private doc: Document) {
    super();
    this.cookies = this.getCookies();
  }

  protected readRawCookie(): string {
    return this.doc.cookie || '';
  }

  writeRawCookie(key: string, value: string, options: CookieOptions): void {
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

  protected rawCookieLength(): number {
    return this.doc.cookie.length;
  }
}
