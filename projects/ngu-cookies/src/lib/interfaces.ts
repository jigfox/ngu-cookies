import { CookieOptions as ExpressCookieOptions } from 'express';

export enum SameSite {
  Lax = 'lax',
  Strict = 'strict',
  None = 'none',
}

export interface CookieOptions extends ExpressCookieOptions {
  sameSite?: SameSite;
  skipUriEncoding?: boolean;
}

export interface CookieBackend {
  readRawCookie(): string;
  writeRawCookie(key: string, value: string, options: CookieOptions): void;
}
