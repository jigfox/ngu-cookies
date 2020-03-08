import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface CookieOptions {
  expires?: Date;
  domain?: string;
  maxAge?: number;
  path?: string;
  secure?: boolean;
}

@Injectable()
export class CookiesService {
  protected cookies = new Map<string, string>();

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.parseCookies();
  }

  get(key: string): string {
    return this.cookies.get(key);
  }

  put(key: string, value: string, options: CookieOptions = {}): void {
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
