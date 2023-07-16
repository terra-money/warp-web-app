import { CreateTxOptions } from '@terra-money/feather.js';
import { useAsyncFn } from 'react-use';
import { useTransactionsContext } from '.';
import { addTxAction } from './actions';
import { PostResponse } from '@terra-money/wallet-kit';
import { FailedTransaction, TransactionPayload, TransactionStatus } from './types';
import { failedSubject } from './rx';
import { LocalWallet, useLocalWallet, useRefCallback } from '../../hooks';

type TxOrFactory<Options> =
  | CreateTxOptions
  | ((options: Omit<Options, 'wallet'> & { wallet: LocalWallet }) => Promise<CreateTxOptions>);

type PayloadOrFactory<Options> = TransactionPayload | ((options: Options) => TransactionPayload);

interface UseTxOptions {
  waitForCompletion?: boolean;
}

type TxError = Pick<FailedTransaction, 'error'> | any;

const useTx = <Options>(
  txOrFactory: TxOrFactory<Options>,
  payloadOrFactory: PayloadOrFactory<Options> = {},
  useTxOptions: UseTxOptions = { waitForCompletion: false }
) => {
  const [, dispatch] = useTransactionsContext();

  const wallet = useLocalWallet();

  const txCallback = useRefCallback(
    async (options: Options) => {
      if (wallet === undefined) {
        throw new Error('The wallet is not connected or is unable to post a message.');
      }

      const payload = typeof payloadOrFactory === 'function' ? payloadOrFactory(options) : payloadOrFactory;

      let tx: CreateTxOptions;

      try {
        tx = typeof txOrFactory === 'function' ? await txOrFactory({ ...options, wallet }) : txOrFactory;
      } catch (error: any) {
        failedSubject.next({
          txHash: '',
          status: TransactionStatus.Failed,
          payload,
          error,
        });
        throw error;
      }

      let resp: PostResponse;
      try {
        resp = await wallet.wallet.post(tx);
      } catch (error: TxError) {
        // if the tx fails here it means it didn't make it to the mempool
        failedSubject.next({
          txHash: '',
          status: TransactionStatus.Failed,
          payload,
          error,
        });
        throw error;
      }

      // NOTE: awaiting this dispatch means that the TX response that
      // is returned will actually complete once the tx has completed,
      // however we are displaying a pending operation status so
      // we really want the response to complete when the tx has been
      // submitted to the mempool
      const completion = dispatch(addTxAction(resp.result!.txhash, payload, wallet.lcd));

      if (useTxOptions.waitForCompletion) {
        await completion;
      }

      return resp;
    },
    [wallet]
  );

  return useAsyncFn(txCallback);
};

export { useTx };
