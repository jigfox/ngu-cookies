import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CookieBackend, CookieOptions } from '../interfaces';

@Injectable()
export class BrowserBackendService implements CookieBackend {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  readRawCookie(): string {
    return this.doc.cookie || '';
  }

  writeRawCookie(key: string, value: string, options: CookieOptions): void {
    const cookieEntries = [`${key}=${value}`];
    if (options.expires) {
      cookieEntries.push(`Expires=${options.expires.toUTCString()}`);
    }
    if (options.domain) {
      cookieEntries.push(`Domain=${options.domain}`);
    }
    if (options.maxAge) {
      cookieEntries.push(`Max-Age=${options.maxAge}`);
    }
    if (options.path) {
      cookieEntries.push(`Path=${options.path}`);
    }
    if (options.secure) {
      cookieEntries.push('Secure');
    }
    if (options.sameSite) {
      cookieEntries.push(`SameSite=${options.sameSite}`);
    }
    this.doc.cookie = cookieEntries.join('; ');
  }
}
