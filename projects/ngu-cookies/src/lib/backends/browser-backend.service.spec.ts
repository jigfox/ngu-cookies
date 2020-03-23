import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { SameSite } from '../interfaces';
import { BrowserBackendService } from './browser-backend.service';

class DocumentMock {
  set cookie(_: string) {}
  get cookie(): string {
    return '';
  }
}

describe('BrowserBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useClass: DocumentMock },
        BrowserBackendService,
      ],
    });
  });

  describe('.readRawCookie()', () => {
    it('reads cookies from document', () => {
      const doc = TestBed.inject(DOCUMENT);
      const browserService = TestBed.inject(BrowserBackendService);
      jest.spyOn(doc, 'cookie', 'get').mockReturnValue('k=v');
      expect(browserService.readRawCookie()).toEqual('k=v');
    });
  });

  describe('.writeRawCookie', () => {
    it('writes cookie as string to document', () => {
      const browserService = TestBed.inject(BrowserBackendService);
      const doc = TestBed.inject(DOCUMENT);
      const spy = jest.spyOn(doc, 'cookie', 'set');
      browserService.writeRawCookie('k', 'v', {});
      expect(spy).toHaveBeenCalledWith('k=v');
    });

    it('sets secure flag if given', () => {
      const browserService = TestBed.inject(BrowserBackendService);
      const doc = TestBed.inject(DOCUMENT);
      const spy = jest.spyOn(doc, 'cookie', 'set');
      browserService.writeRawCookie('k', 'v', { secure: true });
      expect(spy).toHaveBeenCalledWith('k=v; Secure');
    });

    it('sets SameSite correctly if given', () => {
      const browserService = TestBed.inject(BrowserBackendService);
      const doc = TestBed.inject(DOCUMENT);
      const spy = jest.spyOn(doc, 'cookie', 'set');
      browserService.writeRawCookie('k', 'v', { sameSite: SameSite.Lax });
      expect(spy).toHaveBeenCalledWith('k=v; SameSite=lax');
    });

    it('sets path if given', () => {
      const browserService = TestBed.inject(BrowserBackendService);
      const doc = TestBed.inject(DOCUMENT);
      const spy = jest.spyOn(doc, 'cookie', 'set');
      browserService.writeRawCookie('k', 'v', { path: '/path' });
      expect(spy).toHaveBeenCalledWith('k=v; Path=/path');
    });

    it('sets Max-Age if given', () => {
      const browserService = TestBed.inject(BrowserBackendService);
      const doc = TestBed.inject(DOCUMENT);
      const spy = jest.spyOn(doc, 'cookie', 'set');
      browserService.writeRawCookie('k', 'v', { maxAge: 100 });
      expect(spy).toHaveBeenCalledWith('k=v; Max-Age=100');
    });

    it('sets domain if given', () => {
      const browserService = TestBed.inject(BrowserBackendService);
      const doc = TestBed.inject(DOCUMENT);
      const spy = jest.spyOn(doc, 'cookie', 'set');
      browserService.writeRawCookie('k', 'v', { domain: 'blah.example.com' });
      expect(spy).toHaveBeenCalledWith('k=v; Domain=blah.example.com');
    });

    it('sets expires as utc string if given', () => {
      const browserService = TestBed.inject(BrowserBackendService);
      const doc = TestBed.inject(DOCUMENT);
      const spy = jest.spyOn(doc, 'cookie', 'set');
      const expires = new Date();
      browserService.writeRawCookie('k', 'v', { expires });
      expect(spy).toHaveBeenCalledWith(`k=v; Expires=${expires.toUTCString()}`);
    });
  });
});
