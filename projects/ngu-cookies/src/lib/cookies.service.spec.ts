import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { CookiesService, SameSite } from './cookies.service';

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
        CookiesService,
        { provide: DOCUMENT, useClass: DocumentMock },
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

    it('can read new cookie', () => {
      service.put('new', 'cookie');
      expect(service.get('new')).toEqual('cookie');
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
