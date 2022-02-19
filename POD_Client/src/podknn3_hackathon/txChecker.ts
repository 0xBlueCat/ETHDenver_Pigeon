import { DefaultPODKNN3HackathonCore } from "../common/core";
import { EnvelopeOpened, RSS3Followed } from "../api/common";
import { foreverPromise } from "../utils/promise";

const updateBatchSize = 50;
export class TxChecker {
  static async updateEnvelopeTxStatus(): Promise<void> {
    const uncompletedTxs =
      await DefaultPODKNN3HackathonCore.envelopeDB.getUncompletedTx(
        updateBatchSize
      );
    for (const uncompletedTx of uncompletedTxs) {
      const rcp =
        await DefaultPODKNN3HackathonCore.polygonProvider.getTransactionReceipt(
          uncompletedTx.txHash
        );
      if (!rcp) {
        break;
      }
      await DefaultPODKNN3HackathonCore.envelopeDB.updateEnvelopeStatus({
        address: uncompletedTx.address,
        txHash: uncompletedTx.txHash,
        height: rcp.blockNumber,
        txStatus: "completed",
        status: EnvelopeOpened,
      });
    }
  }

  static async updateRSS3FollowTxStatus(): Promise<void> {
    const uncompletedTxs =
      await DefaultPODKNN3HackathonCore.rss3FollowDB.getUncompletedTx(
        updateBatchSize
      );
    for (const uncompletedTx of uncompletedTxs) {
      const rcp =
        await DefaultPODKNN3HackathonCore.polygonProvider.getTransactionReceipt(
          uncompletedTx.txHash
        );
      if (!rcp) {
        break;
      }
      await DefaultPODKNN3HackathonCore.rss3FollowDB.updateRSS3FollowStatus({
        address: uncompletedTx.address,
        txHash: uncompletedTx.txHash,
        height: rcp.blockNumber,
        txStatus: "completed",
        status: RSS3Followed,
      });
    }
  }

  static start(): void {
    foreverPromise(
      async (_) => {
        await TxChecker.updateEnvelopeTxStatus();
        await TxChecker.updateRSS3FollowTxStatus();
      },
      {
        onResolvedInterval: 10000,
        onRejectedInterval: 5000,
      }
    );
  }
}
