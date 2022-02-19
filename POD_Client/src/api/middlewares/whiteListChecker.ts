import { PODKNN3HackathonResponse } from "../common";
import { DefaultPODKNN3HackathonCore } from "../../common/core";
import { ErrorCode } from "../error";

export async function whiteListCheck(
  params: any
): Promise<PODKNN3HackathonResponse | undefined> {
  const address = params.address;
  if (!address) {
    return undefined;
  }
  if (!DefaultPODKNN3HackathonCore.cfg.common!.onlyWhiteList) {
    return undefined;
  }
  if (!DefaultPODKNN3HackathonCore.whiteList.get(address)) {
    return PODKNN3HackathonResponse.fromError(ErrorCode.NotWhiteListAddress);
  }
}
