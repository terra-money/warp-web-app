import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { useWarpConfig } from 'queries/useConfigQuery';
import { useEffect, useRef } from 'react';
import { LUNA } from 'types';
import { warp_controller } from '../types/contracts';
import { TX_KEY } from './txKey';

export type CreateTemplateTxProps = warp_controller.SubmitTemplateMsg;

type SubmitTemplateMsg = Extract<warp_controller.ExecuteMsg, { submit_template: {} }>;

export const useCreateTemplateTx = () => {
  const contractAddress = useContractAddress('warp-controller');

  const { data: config } = useWarpConfig();

  const configRef = useRef<warp_controller.Config | undefined>();

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  return useTx<CreateTemplateTxProps>(
    (options) => {
      const { wallet, formatted_str, vars, name, msg, condition } = options;

      if (!configRef.current) {
        return { msgs: [] };
      }

      return TxBuilder.new()
        .execute<SubmitTemplateMsg>(
          wallet.walletAddress,
          contractAddress,
          {
            submit_template: {
              formatted_str,
              condition,
              vars,
              name,
              msg,
            },
          },
          {
            [LUNA.denom]: configRef.current.template_fee,
          }
        )
        .build();
    },
    {
      txKey: TX_KEY.CREATE_TEMPLATE,
    }
  );
};
