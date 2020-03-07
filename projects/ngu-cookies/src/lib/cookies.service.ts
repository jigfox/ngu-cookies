import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class CookiesService {
  protected cookies = new Map<string, string>();

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.parseCookies();
  }

  get(key: string): string {
    return this.cookies.get(key);
  }

  put(key: string, value: string): void {
    this.cookies.set(key, value);
    this.doc.cookie = `${key}=${value}`;
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
