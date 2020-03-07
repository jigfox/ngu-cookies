import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { CookiesService } from './cookies.service';

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

  describe('.put(key: string, value: string)', () => {
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
  });
});
