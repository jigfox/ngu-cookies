import { TestBed } from '@angular/core/testing';
import { BackendCookieHandlerService } from './backend-cookies-handler.service';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { CookieOptions } from 'projects/ngu-cookies/src/lib/browser-cookies-handler.service';

const reqMock = {
  headers: {
    cookie: '',
  },
};

const resMock = {
  cookie: jest.fn(),
};

describe('BackendCookieHandlerService', () => {
  let service: BackendCookieHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: REQUEST, useValue: reqMock },
        { provide: RESPONSE, useValue: resMock },
        BackendCookieHandlerService,
      ],
    });
  });

  afterEach(() => {
    reqMock.headers.cookie = '';
    resMock.cookie.mockReset();
  });

  it('parses cookie header', () => {
    reqMock.headers.cookie = 'firstCookie=firstValue; secondCookie=secondValue';
    service = TestBed.inject(BackendCookieHandlerService);
    expect(service.readCookie('firstCookie')).toEqual('firstValue');
  });

  it('forwards cookie writing to express response', () => {
    service = TestBed.inject(BackendCookieHandlerService);
    const options: CookieOptions = {
      maxAge: 100,
    };
    service.writeCookie('someCookie', 'someValue', options);
    expect(resMock.cookie).toHaveBeenCalledWith(
      'someCookie',
      'someValue',
      options,
    );
  });
});
