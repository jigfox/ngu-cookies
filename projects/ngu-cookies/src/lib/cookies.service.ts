import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class CookiesService {
  protected cookies = new Map<string, string>();

  constructor(@Inject(DOCUMENT) doc: Document) {
    (doc.cookie ?? '')
      .split(/; */)
      .map(pair => pair.split('=').map(a => a.trim()))
      .forEach(([key, value]) => {
        this.cookies.set(key, value);
      });
  }

  get(key: string): string {
    return this.cookies.get(key);
  }
}
