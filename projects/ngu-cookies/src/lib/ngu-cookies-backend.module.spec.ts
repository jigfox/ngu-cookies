import { TestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';

import { NguCookiesModule, CookieConfig } from './ngu-cookies.module';
import { NguCookiesBackendModule } from './ngu-cookies-backend.module';
import { CookiesService } from './cookies.service';
import { CookieHandlerService } from './cookie-handler.service';
import {
  BrowserCookieHandlerService,
  CookieOptions,
} from './browser-cookies-handler.service';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { BackendCookieHandlerService } from './backend-cookies-handler.service';

@NgModule({ imports: [NguCookiesBackendModule] })
class TestModule {}

@NgModule({ imports: [TestModule] })
class TestModule2 {}

describe('NguCookiesBackendModule', () => {
  describe('without NguCookiesModule', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NguCookiesBackendModule],
        providers: [],
      });
    });

    it('fails to create', () => {
      expect(() => TestBed.inject(CookieHandlerService)).toThrowError(
        /requires NguCookiesModule/,
      );
    });
  });

  describe('with NguCookiesModule', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NguCookiesModule, NguCookiesBackendModule],
        providers: [
          { provide: REQUEST, useValue: { headers: { cookie: '' } } },
          { provide: RESPONSE, useValue: { cookie: jest.fn() } },
        ],
      });
    });

    it('succeeds to create', () => {
      expect(() => TestBed.inject(CookieHandlerService)).not.toThrowError();
    });

    it('provides CookieHandlerService as BackendCookieHandlerService', () => {
      expect(TestBed.get(CookieHandlerService)).toBeInstanceOf(
        BackendCookieHandlerService,
      );
    });
  });
});
