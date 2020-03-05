import { TestBed } from '@angular/core/testing';

import { NguCookiesService } from './ngu-cookies.service';

describe('NguCookiesService', () => {
  let service: NguCookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NguCookiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
