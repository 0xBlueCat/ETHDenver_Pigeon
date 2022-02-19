import { PODKNN3HackathonResponse } from "../common";
import { ErrorCode } from "../error";

export async function paramsChecker(
  params: any
): Promise<PODKNN3HackathonResponse | undefined> {
  let err = addressCheck(params);
  if (err) {
    return err;
  }
  return;
}

function addressCheck(params: any): PODKNN3HackathonResponse | undefined {
  const address = params.address;
  if (address === undefined) {
    return;
  }
  if (typeof address !== "string" || address === "") {
    return PODKNN3HackathonResponse.fromError(
      ErrorCode.InvalidParams,
      "invalid address"
    );
  }
}
