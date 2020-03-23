import { TestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { NguCookiesModule } from './ngu-cookies.module';
import { NguCookiesBackendModule } from './ngu-cookies-backend.module';
import { BackendService } from './cookies.service';
import { ServerBackendService } from './backends/server-backend.service';

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
      expect(() => TestBed.inject(BackendService)).toThrowError(
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
      expect(() => TestBed.inject(BackendService)).not.toThrowError();
    });

    it('provides ServerBackendService as BackendService', () => {
      expect(TestBed.get(BackendService)).toBeInstanceOf(ServerBackendService);
    });
  });
});
