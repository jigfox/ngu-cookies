import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { CookiesService } from './cookies.service';

describe('CookiesService', () => {
  let service: CookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CookiesService,
        { provide: DOCUMENT, useValue: { cookie: 'key1=value1; key2=value2' } },
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
});
