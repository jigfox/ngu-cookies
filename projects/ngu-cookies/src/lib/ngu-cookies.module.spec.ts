import { TestBed } from '@angular/core/testing';

import { NguCookiesModule } from './ngu-cookies.module';
import {
  CookiesService,
  BackendService,
  CookieConfig,
} from './cookies.service';
import { BrowserBackendService } from './backends/browser-backend.service';
import { CookieOptions } from './interfaces';

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
      expect(TestBed.inject(BackendService)).toBeTruthy();
      expect(TestBed.inject(BackendService)).toBeInstanceOf(
        BrowserBackendService,
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
      expect(TestBed.inject(BackendService)).toBeTruthy();
      expect(TestBed.inject(BackendService)).toBeInstanceOf(
        BrowserBackendService,
      );
    });

    it('does not provide CookieConfig', () => {
      expect(TestBed.inject(CookieConfig)).toEqual(config);
    });
  });
});
