import {
  IPODKNN3HackathonMiddlewareRegister,
  PODKNN3HackathonHandler,
  PODKNN3HackathonResponse,
} from "./common";
import { ErrorCode } from "./error";
import { logger } from "../common/logger";
import { trimObj } from "../utils/utils";

export class PODKNN3HackathonHandlerRegister {
  private readonly handlers: Map<string, PODKNN3HackathonHandler>;

  constructor(private middleware: IPODKNN3HackathonMiddlewareRegister) {
    this.handlers = new Map<string, PODKNN3HackathonHandler>();
  }

  register(name: string, handler: PODKNN3HackathonHandler) {
    this.handlers.set(
      name,
      async (params: any): Promise<PODKNN3HackathonResponse> => {
        params = trimObj(params);
        try {
          const res = await this.middleware.process(params);
          if (res) {
            return res;
          }

          return await handler(params);
        } catch (e) {
          logger.error(
            `PODKNN3HackathonHandler name:${name} params:${JSON.stringify(
              params
            )} process error:${e}`
          );
          return PODKNN3HackathonResponse.fromError(
            ErrorCode.UnknownError,
            e.toString()
          );
        }
      }
    );
  }

  getHandlers(): Map<string, PODKNN3HackathonHandler> {
    return this.handlers;
  }

  getHandler(name: string): PODKNN3HackathonHandler | undefined {
    return this.handlers.get(name);
  }
}
