import {
  EnvelopeOpened,
  IPODKNN3HackathonHandlerRegister,
  PODKNN3HackathonResponse,
  RSS3Followed,
  RSS3Unfollowed,
} from "../common";
import { PODKNN3HackathonHandlerRegister } from "../handlerRegister";
import { getDefaultMiddlewareRegister } from "../middlewares/middlewares";
import * as pod from "poddb-evm-sdk-ts";
import { DefaultPODKNN3HackathonCore } from "../../common/core";
import { ErrorCode } from "../error";

export function getDefaultHandlerRegister(): IPODKNN3HackathonHandlerRegister {
  const defaultRegister = new PODKNN3HackathonHandlerRegister(
    getDefaultMiddlewareRegister()
  );
  defaultRegister.register("openEnvelope", openEnvelope);
  defaultRegister.register("getEnvelopeOpenStatus", getEnvelopeOpenStatus);
  defaultRegister.register("rss3Follow", rss3Follow);
  defaultRegister.register("getRSS3FollowStatus", getRSS3FollowStatus);
  defaultRegister.register(
    "getUpdateCompletedTasksSignature",
    getUpdateCompletedTasksSignature
  );
  return defaultRegister;
}

export interface openEnvelopeParams {
  address: string;
}

async function openEnvelope(
  param: openEnvelopeParams
): Promise<PODKNN3HackathonResponse> {
  const status = await DefaultPODKNN3HackathonCore.envelopeDB.getEnvelopeStatus(
    param.address
  );
  if (status) {
    if (status.status === EnvelopeOpened) {
      return PODKNN3HackathonResponse.fromError(ErrorCode.HasAlreadyOpened);
    }
    return PODKNN3HackathonResponse.fromData("pending");
  }

  const tx = await DefaultPODKNN3HackathonCore.getTagContract().setTag(
    DefaultPODKNN3HackathonCore.cfg.pod!.envelopClassId,
    pod.TagObject.fromAddress(param.address)
  );

  await DefaultPODKNN3HackathonCore.envelopeDB.updateEnvelopeStatus({
    address: param.address,
    status: EnvelopeOpened,
    txHash: tx.hash,
    height: 0,
    txStatus: "pending",
  });
  return PODKNN3HackathonResponse.fromData("success");
}

export async function getEnvelopeOpenStatus(
  param: openEnvelopeParams
): Promise<PODKNN3HackathonResponse> {
  const status = await DefaultPODKNN3HackathonCore.envelopeDB.getEnvelopeStatus(
    param.address
  );
  if (status) {
    if (status.status === EnvelopeOpened) {
      return PODKNN3HackathonResponse.fromData("opened");
    }
    return PODKNN3HackathonResponse.fromData("pending");
  }
  return PODKNN3HackathonResponse.fromData("unopened");
}

export interface rss3FollowParams {
  address: string;
}

export async function rss3Follow(
  param: rss3FollowParams
): Promise<PODKNN3HackathonResponse> {
  const status =
    await DefaultPODKNN3HackathonCore.rss3FollowDB.getRSS3FollowStatus(
      param.address
    );
  if (status) {
    if (status.status === RSS3Followed) {
      return PODKNN3HackathonResponse.fromError(ErrorCode.HasAlreadyFollowed);
    }
    return PODKNN3HackathonResponse.fromData("pending");
  }

  const tx = await DefaultPODKNN3HackathonCore.getTagContract().setTag(
    DefaultPODKNN3HackathonCore.cfg.pod!.rss3FollowClassId,
    pod.TagObject.fromAddress(param.address)
  );

  await DefaultPODKNN3HackathonCore.rss3FollowDB.updateRSS3FollowStatus({
    address: param.address,
    status: RSS3Unfollowed,
    txHash: tx.hash,
    height: 0,
    txStatus: "pending",
  });
  return PODKNN3HackathonResponse.fromData("success");
}

export interface getRSS3FollowStatusParams {
  address: string;
}

export async function getRSS3FollowStatus(
  params: getRSS3FollowStatusParams
): Promise<PODKNN3HackathonResponse> {
  const status =
    await DefaultPODKNN3HackathonCore.rss3FollowDB.getRSS3FollowStatus(
      params.address
    );
  console.log(JSON.stringify(status));
  if (status) {
    if (status.status === RSS3Followed) {
      return PODKNN3HackathonResponse.fromData("followed");
    }
    return PODKNN3HackathonResponse.fromData("pending");
  }
  return PODKNN3HackathonResponse.fromData("unfollowed");
}

export interface getUpdateCompletedTasksSignatureParams {
  address: string;
  completedTasks: number[];
}

async function getUpdateCompletedTasksSignature(
  params: getUpdateCompletedTasksSignatureParams
): Promise<PODKNN3HackathonResponse> {
  return PODKNN3HackathonResponse.fromData(
    await DefaultPODKNN3HackathonCore.tagContract.getSignatureForSetTag(
      DefaultPODKNN3HackathonCore.polygonWallet,
      DefaultPODKNN3HackathonCore.cfg.pod?.taskClassId!,
      pod.TagObject.fromAddress(params.address),
      new pod.WriteBuffer()
        .writeArray(params.completedTasks, pod.TagFieldType.Uint8)
        .getBytes()
    )
  );
}
