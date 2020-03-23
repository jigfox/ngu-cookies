import { TestBed } from '@angular/core/testing';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { ServerBackendService } from './server-backend.service';

const requestMock = {
  headers: {
    get cookie(): string {
      return 'key=value';
    },
  },
};

const responseMock = {
  cookie: jest.fn(),
};

describe('ServerBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: REQUEST, useValue: requestMock },
        { provide: RESPONSE, useValue: responseMock },
        ServerBackendService,
      ],
    });
  });

  describe('.readRawCookie()', () => {
    it('returns cookie string from header', () => {
      const backendService = TestBed.inject(ServerBackendService);
      const spy = jest.spyOn(requestMock.headers, 'cookie', 'get');
      expect(backendService.readRawCookie()).toEqual('key=value');
      expect(spy).toHaveBeenCalled();
    });

    it('returns empty string if cookie is undefine', () => {
      const backendService = TestBed.inject(ServerBackendService);
      const spy = jest
        .spyOn(requestMock.headers, 'cookie', 'get')
        .mockReturnValue(undefined);
      expect(backendService.readRawCookie()).toEqual('');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('.writeRawCookie()', () => {
    it('passes all arguments to res.cookie', () => {
      const key = 'key';
      const value = 'value';
      const options = { maxAge: 10 };
      const backendService = TestBed.inject(ServerBackendService);
      backendService.writeRawCookie(key, value, options);
      expect(responseMock.cookie).toHaveBeenCalledWith(key, value, options);
    });
  });
});
