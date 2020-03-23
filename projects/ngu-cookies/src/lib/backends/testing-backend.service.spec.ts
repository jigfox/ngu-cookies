import { TestBed } from '@angular/core/testing';
import { TestingBackendService } from './testing-backend.service';

describe('TestingBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestingBackendService],
    });
  });

  describe('.readRawCookie() and .writeRawCookie()', () => {
    it('it is empty by default', () => {
      const backendService = TestBed.inject(TestingBackendService);
      expect(backendService.readRawCookie()).toBe('');
    });

    it('can read previously written cookies', () => {
      const backendService = TestBed.inject(TestingBackendService);
      backendService.writeRawCookie('key', 'value');
      expect(backendService.readRawCookie()).toEqual('key=value');
    });

    it('can read multiple written cookies', () => {
      const backendService = TestBed.inject(TestingBackendService);
      backendService.writeRawCookie('key', 'value');
      backendService.writeRawCookie('key2', 'value2');

      expect(backendService.readRawCookie()).toEqual('key=value; key2=value2');
    });

    it('removes cookie if expires in in past', () => {
      const backendService = TestBed.inject(TestingBackendService);
      backendService.writeRawCookie('key', 'value');
      expect(backendService.readRawCookie()).toEqual('key=value');
      const expires = new Date(0);
      backendService.writeRawCookie('key', 'value', { expires });
      expect(backendService.readRawCookie()).toEqual('');
    });
  });

  describe('.clear()', () => {
    it('clears all cookies', () => {
      const backendService = TestBed.inject(TestingBackendService);
      backendService.writeRawCookie('key', 'value');
      backendService.writeRawCookie('key2', 'value');
      expect(backendService.readRawCookie()).toEqual('key=value; key2=value');

      backendService.clear();
      expect(backendService.readRawCookie()).toEqual('');
    });
  });

  describe('.count', () => {
    it('returns count of cookies', () => {
      const backendService = TestBed.inject(TestingBackendService);
      backendService.writeRawCookie('key', 'value');
      backendService.writeRawCookie('key2', 'value');
      expect(backendService.count).toEqual(2);
    });
  });

  describe('.getCookie()', () => {
    it('returns cookie including options', () => {
      const options = { path: '/', domain: 'example.com' };
      const backendService = TestBed.inject(TestingBackendService);
      backendService.writeRawCookie('key', 'value', options);

      expect(backendService.getCookie('key').options).toEqual(options);
      expect(backendService.getCookie('key').key).toEqual('key');
      expect(backendService.getCookie('key').value).toEqual('value');
    });
  });
});
