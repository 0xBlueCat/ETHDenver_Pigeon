export class PODKNN3HackathonError {
  Code: ErrorCode;
  Message: string;

  constructor(code: ErrorCode, message?: string) {
    this.Code = code;
    if (message) {
      this.Message = message;
      return;
    }
    message = errMessages.get(code);
    if (message) {
      this.Message = message;
    }
  }
}

export enum ErrorCode {
  Ok = 0,
  InvalidParams = 1000,
  HasAlreadyOpened = 1001,
  HasAlreadyFollowed = 1002,
  NotWhiteListAddress = 1003,
  UnknownError = 9999,
}

const errMessages = new Map([
  [ErrorCode.Ok, "ok"],
  [ErrorCode.InvalidParams, "invalid params"],
  [ErrorCode.HasAlreadyOpened, "envelope has already opened"],
  [ErrorCode.HasAlreadyFollowed, "task has already followed"],
  [ErrorCode.NotWhiteListAddress, "not in white list"],
  [ErrorCode.UnknownError, "unknown error"],
]);

export const ErrorOk = new PODKNN3HackathonError(ErrorCode.Ok);
