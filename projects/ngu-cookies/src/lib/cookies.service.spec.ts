import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { CookiesService } from './cookies.service';
import {
  SameSite,
  BrowserCookieHandlerService,
} from './browser-cookies-handler.service';
import { CookieHandlerService } from './cookie-handler.service';

class DocumentMock {
  get cookie(): string {
    return 'key1=value1; key2=value2';
  }
  set cookie(cookie: string) {}
}

describe('CookiesService', () => {
  let service: CookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useClass: DocumentMock },
        {
          provide: CookieHandlerService,
          useClass: BrowserCookieHandlerService,
        },
        CookiesService,
      ],
    });
    service = TestBed.inject(CookiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('.get(key: string)', () => {
    [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ].forEach(({ key, value }) => {
      it(`returns '${value}' for '${key}'`, () => {
        expect(service.get(key)).toEqual(value);
      });
    });
  });

  describe('.put(key: string, value: string, options: CookieOptions)', () => {
    [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ].forEach(({ key, value }) => {
      it(`writes '${key}=${value}' to docuemnt.cookie`, () => {
        const doc = TestBed.inject(DOCUMENT);
        const spy = spyOnProperty(doc, 'cookie', 'set');
        service.put(key, value);
        expect(spy).toHaveBeenCalledWith(`${key}=${value}`);
      });
    });

    describe('setting invalid cookies', () => {
      describe('invalid values', () => {
        [
          { illegal: ' ', key: 'key', value: 'in valid' },
          { illegal: '"', key: 'key', value: 'in"valid' },
          { illegal: ';', key: 'key', value: 'in;valid' },
          { illegal: ',', key: 'key', value: 'in,valid' },
          { illegal: '\\', key: 'key', value: 'in\\valid' },
        ].forEach(({ illegal, key, value }) => {
          it(`throws error for values containing '${illegal}'`, () => {
            expect(() =>
              service.put(key, value, { skipUriEncoding: true }),
            ).toThrowError();
          });

          it(`doesn not throw error for values containing '${illegal}' when encoded`, () => {
            expect(() => service.put(key, value)).not.toThrowError();
          });
        });

        const allAllowedCharactersFoValue =
          "!#$%&'()*+-./01234567890:<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
        it(`allows "${allAllowedCharactersFoValue}"`, () => {
          expect(() =>
            service.put('key', allAllowedCharactersFoValue, {
              skipUriEncoding: true,
            }),
          ).not.toThrowError();
        });
      });
      describe('invalid keys', () => {
        [
          { illegal: ' ', value: 'value', key: 'in valid' },
          { illegal: '"', value: 'value', key: 'in"valid' },
          { illegal: ';', value: 'value', key: 'in;valid' },
          { illegal: ',', value: 'value', key: 'in,valid' },
          { illegal: '\\', value: 'value', key: 'in\\valid' },
          { illegal: '(', value: 'value', key: 'in(valid' },
          { illegal: ')', value: 'value', key: 'in)valid' },
          { illegal: '>', value: 'value', key: 'in>valid' },
          { illegal: '<', value: 'value', key: 'in<valid' },
          { illegal: '@', value: 'value', key: 'in@valid' },
          { illegal: ':', value: 'value', key: 'in:valid' },
          { illegal: '/', value: 'value', key: 'in/valid' },
          { illegal: '[', value: 'value', key: 'in[valid' },
          { illegal: ']', value: 'value', key: 'in]valid' },
          { illegal: '?', value: 'value', key: 'in?valid' },
          { illegal: '=', value: 'value', key: 'in=valid' },
          { illegal: '{', value: 'value', key: 'in{valid' },
          { illegal: '}', value: 'value', key: 'in}valid' },
        ].forEach(({ illegal, key, value }) => {
          it(`throws error for keys containing '${illegal}'`, () => {
            expect(() =>
              service.put(key, value, { skipUriEncoding: true }),
            ).toThrowError();
          });
        });
        const allAllowedCharactersForKey =
          "!#$%&'*+-.01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
        it(`allows "${allAllowedCharactersForKey}"`, () => {
          expect(() =>
            service.put(allAllowedCharactersForKey, 'value', {
              skipUriEncoding: true,
            }),
          ).not.toThrowError();
        });
      });
    });

    it('can read new cookie', () => {
      service.put('new', 'cookie');
      expect(service.get('new')).toEqual('cookie');
    });

    it('decodes cookie correctly', () => {
      service.put('cookie', '%20', { skipUriEncoding: true });
      expect(service.get('cookie')).toEqual(' ');
    });

    it('skips decoding', () => {
      service.put('cookie', ' ');
      expect(service.get('cookie', true)).toEqual('%20');
    });

    describe('setting expiration', () => {
      it('sets expiration date as utc date', () => {
        const doc = TestBed.inject(DOCUMENT);
        const spy = spyOnProperty(doc, 'cookie', 'set');
        const expires = new Date();
        service.put('name', 'value', { expires });
        expect(spy).toHaveBeenCalledWith(
          `name=value; expires=${expires.toUTCString()}`,
        );
      });
    });

    describe('setting domain', () => {
      it('sets to configured Domain', () => {
        const doc = TestBed.inject(DOCUMENT);
        const spy = spyOnProperty(doc, 'cookie', 'set');
        const domain = 'example.com';
        service.put('name', 'value', { domain });
        expect(spy).toHaveBeenCalledWith('name=value; domain=example.com');
      });
    });

    describe('setting max-age', () => {
      it('set max-age correctly', () => {
        const doc = TestBed.inject(DOCUMENT);
        const spy = spyOnProperty(doc, 'cookie', 'set');
        const maxAge = 100;
        service.put('name', 'value', { maxAge });
        expect(spy).toHaveBeenCalledWith('name=value; max-age=100');
      });
    });

    describe('setting path', () => {
      it('sets path correctly', () => {
        const doc = TestBed.inject(DOCUMENT);
        const spy = spyOnProperty(doc, 'cookie', 'set');
        const path = '/some-path';
        service.put('name', 'value', { path });
        expect(spy).toHaveBeenCalledWith('name=value; path=/some-path');
      });
    });

    describe('setting secure', () => {
      it('adds secure flag if set', () => {
        const doc = TestBed.inject(DOCUMENT);
        const spy = spyOnProperty(doc, 'cookie', 'set');
        const secure = true;
        service.put('name', 'value', { secure });
        expect(spy).toHaveBeenCalledWith('name=value; secure');
      });
    });

    describe('setting samesite', () => {
      it('adds samesite to cookie', () => {
        const doc = TestBed.inject(DOCUMENT);
        const spy = spyOnProperty(doc, 'cookie', 'set');
        const samesite = SameSite.Lax;
        service.put('name', 'value', { samesite });
        expect(spy).toHaveBeenCalledWith('name=value; samesite=lax');
      });
    });

    // http://browsercookielimits.squawky.net/
    describe('cookie limits', () => {
      it('throws error if more than 50 cookies are added', () => {
        const doc = TestBed.inject(DOCUMENT);
        spyOnProperty(doc, 'cookie', 'get').and.returnValue(
          Array(50)
            .fill(0)
            .map((v, i) => `c${i}=${v}`)
            .join(';'),
        );

        expect(() => service.put(`a51`, '')).toThrowError();
      });

      it('throws allows 50th cookie', () => {
        const doc = TestBed.inject(DOCUMENT);
        spyOnProperty(doc, 'cookie', 'get').and.returnValue(
          Array(49)
            .fill(0)
            .map((v, i) => `c${i}=${v}`)
            .join(';'),
        );

        expect(() => service.put(`a50`, '')).not.toThrowError();
      });

      it('throws error if more than 4093 bytes will be added', () => {
        const doc = TestBed.inject(DOCUMENT);
        spyOnProperty(doc, 'cookie', 'get').and.returnValue(
          `x=${'a'.repeat(4089)}`, // 4091 bytes
        );
        // add ';b=' 3 bytes
        expect(() => service.put('b', '')).toThrowError();
      });
    });
  });

  describe('.delete(key: string)', () => {
    it('deletes cookie', () => {
      const doc = TestBed.inject(DOCUMENT);
      const spy = spyOnProperty(doc, 'cookie', 'set');
      expect(service.get('key1')).toBeTruthy();
      service.delete('key1');
      expect(service.get('key1')).toBeFalsy();
      expect(spy).toHaveBeenCalledWith(
        'key1=; expires=Thu, 01 Jan 1970 00:00:00 GMT',
      );
    });
  });
});
