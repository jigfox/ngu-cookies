import { TestBed } from '@angular/core/testing';

import { CookiesService, BackendService } from './cookies.service';
import { TestingBackendService } from './backends/testing-backend.service';
import { SameSite } from './interfaces';

describe('CookiesService', () => {
  let service: CookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: BackendService, useClass: TestingBackendService },
        CookiesService,
      ],
    });
    service = TestBed.inject(CookiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('parses all existing cookies', () => {
      const backend = new TestingBackendService();
      backend.writeRawCookie('key1', 'value1');
      backend.writeRawCookie('key2', 'value2');
      const cookies = new CookiesService(backend, null);
      expect(cookies.get('key1')).toEqual('value1');
      expect(cookies.get('key2')).toEqual('value2');
    });
  });

  describe('.put(key: string, value: string, options: CookieOptions) .get(key: string)', () => {
    [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ].forEach(({ key, value }) => {
      it(`writes '${key}=${value}' to docuemnt.cookie`, () => {
        service.put(key, value);
        expect(service.get(key)).toEqual(value);
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
        const expires = new Date();
        service.put('name', 'value', { expires });
      });
    });

    describe('setting domain', () => {
      it('sets to configured Domain', () => {
        const domain = 'example.com';
        service.put('name', 'value', { domain });
      });
    });

    describe('setting max-age', () => {
      it('set max-age correctly', () => {
        const maxAge = 100;
        service.put('name', 'value', { maxAge });
      });
    });

    describe('setting path', () => {
      it('sets path correctly', () => {
        const path = '/some-path';
        service.put('name', 'value', { path });
      });
    });

    describe('setting secure', () => {
      it('adds secure flag if set', () => {
        const secure = true;
        service.put('name', 'value', { secure });
      });
    });

    describe('setting samesite', () => {
      it('adds samesite to cookie', () => {
        const sameSite = SameSite.Lax;
        service.put('name', 'value', { sameSite });
      });
    });

    // http://browsercookielimits.squawky.net/
    describe('cookie limits', () => {
      it('throws error if more than 50 cookies are added', () => {
        for (let i = 0; i < 50; i++) {
          service.put(`k${i}`, 'v');
        }
        expect(() => service.put(`a51`, '')).toThrowError();
      });

      it('throws allows 50th cookie', () => {
        for (let i = 0; i < 49; i++) {
          service.put(`k${i}`, 'v');
        }
        expect(() => service.put(`a50`, '')).not.toThrowError();
      });

      it('throws error if more than 4093 bytes will be added', () => {
        expect(() => service.put('x', 'a'.repeat(4090))).not.toThrowError();
        // add ';b=' 3 bytes
        expect(() => service.put('b', '')).toThrowError();
      });
    });
  });

  describe('.delete(key: string)', () => {
    it('deletes cookie', () => {
      service.put('key1', 'value');
      expect(service.get('key1')).toBeTruthy();
      service.delete('key1', {});
      expect(service.get('key1')).toBeFalsy();
    });

    it('deletes cookie w/o options', () => {
      service.put('key1', 'value');
      expect(service.get('key1')).toBeTruthy();
      service.delete('key1');
      expect(service.get('key1')).toBeFalsy();
    });
  });
});
