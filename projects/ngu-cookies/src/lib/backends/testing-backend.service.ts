import { Injectable } from '@angular/core';

import { CookieBackend, CookieOptions } from '../interfaces';

interface Cookie {
  key: string;
  value: string;
  options: CookieOptions;
}

@Injectable()
export class TestingBackendService implements CookieBackend {
  private cookies = new Map<string, Cookie>();

  readRawCookie(): string {
    if (this.cookies.size) {
      return Array.from(this.cookies.values())
        .reduce((result, { key, value }) => {
          result.push(`${key}=${value}`);
          return result;
        }, [])
        .join('; ');
    } else {
      return '';
    }
  }

  writeRawCookie(
    key: string,
    value: string,
    options: CookieOptions = {},
  ): void {
    if (options.expires && options.expires < new Date()) {
      this.cookies.delete(key);
    } else {
      this.cookies.set(key, { key, value, options });
    }
  }

  getCookie(key: string): Cookie {
    return this.cookies.get(key);
  }

  clear(): void {
    this.cookies.clear();
  }

  get count(): number {
    return this.cookies.size;
  }
}
