import {
  PODKNN3HackathonMiddlewareAction,
  PODKNN3HackathonResponse,
} from "./common";

export class PODKNN3HackathonMiddlewareRegister {
  private readonly actions: PODKNN3HackathonMiddlewareAction[];

  constructor() {
    this.actions = [];
  }

  register(action: PODKNN3HackathonMiddlewareAction) {
    this.actions.push(action);
  }

  async process(params: any): Promise<PODKNN3HackathonResponse | undefined> {
    for (const action of this.actions) {
      const res = await action(params);
      if (res) {
        return res;
      }
    }
    return undefined;
  }
}
