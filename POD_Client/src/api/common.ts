import { ErrorCode, ErrorOk, PODKNN3HackathonError } from "./error";

export declare type PODKNN3HackathonHandler = (
  params: any
) => Promise<PODKNN3HackathonResponse>;

export interface IPODKNN3HackathonHandlerRegister {
  register(name: string, handler: PODKNN3HackathonHandler);
  getHandlers(): Map<string, PODKNN3HackathonHandler>;
  getHandler(name: string): PODKNN3HackathonHandler | undefined;
}

// if a middleware action return a undefined PODKNN3HackathonResponse,
// the action chain will stop, an return the PODKNN3HackathonResponse to the request.
export declare type PODKNN3HackathonMiddlewareAction = (
  params: any
) => Promise<PODKNN3HackathonResponse | undefined>;

export interface IPODKNN3HackathonMiddlewareRegister {
  register(action: PODKNN3HackathonMiddlewareAction);
  process(params: any): Promise<PODKNN3HackathonResponse | undefined>;
}

export class PODKNN3HackathonResponse {
  Data?: any;
  Error: PODKNN3HackathonError;

  constructor(error?: PODKNN3HackathonError, data?: any) {
    if (error) {
      this.Error = error;
    } else {
      this.Error = ErrorOk;
    }
    if (data != undefined) {
      this.Data = data;
    }
  }

  static fromError(
    code: ErrorCode,
    message?: string
  ): PODKNN3HackathonResponse {
    return new PODKNN3HackathonResponse(
      new PODKNN3HackathonError(code, message)
    );
  }

  static fromData(data: any): PODKNN3HackathonResponse {
    return new PODKNN3HackathonResponse(ErrorOk, data);
  }
}

export const EnvelopeNotOpened = 0;
export const EnvelopeOpened = 1;

export const RSS3Unfollowed = 0;
export const RSS3Followed = 1;
