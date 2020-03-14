import { TestBed } from '@angular/core/testing';

import { NguCookiesModule, CookieConfig } from './ngu-cookies.module';
import { CookiesService } from './cookies.service';
import { CookieHandlerService } from './cookie-handler.service';
import {
  BrowserCookieHandlerService,
  CookieOptions,
} from './browser-cookies-handler.service';

describe('NguCookiesModule', () => {
  describe('without config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NguCookiesModule],
      });
    });

    it('provides CookieService', () => {
      expect(TestBed.inject(CookiesService)).toBeTruthy();
    });

    it('provides CookieHandlerService', () => {
      expect(TestBed.inject(CookieHandlerService)).toBeTruthy();
      expect(TestBed.inject(CookieHandlerService)).toBeInstanceOf(
        BrowserCookieHandlerService,
      );
    });

    it('does not provide CookieConfig', () => {
      expect(() => TestBed.inject(CookieConfig)).toThrowError();
    });
  });

  describe('with config', () => {
    const config: CookieOptions = { path: '/' };
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NguCookiesModule.withConfig({ path: '/' })],
      });
    });

    it('provides CookieService', () => {
      expect(TestBed.inject(CookiesService)).toBeTruthy();
    });

    it('provides CookieHandlerService', () => {
      expect(TestBed.inject(CookieHandlerService)).toBeTruthy();
      expect(TestBed.inject(CookieHandlerService)).toBeInstanceOf(
        BrowserCookieHandlerService,
      );
    });

    it('does not provide CookieConfig', () => {
      expect(TestBed.inject(CookieConfig)).toEqual(config);
    });
  });
});
