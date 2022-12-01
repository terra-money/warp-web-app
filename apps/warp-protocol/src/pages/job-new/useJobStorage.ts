import { demicrofy } from '@terra-money/apps/libs/formatting';
import { useCallback, useMemo } from 'react';
import { LUNA, warp_controller } from 'types';
import { Job } from 'types/job';
import { useLocalStorage } from 'usehooks-ts';
import { DetailsFormInput } from './details-form/useDetailsForm';

export const useJobStorage = () => {
  const [detailsInput, setDetailsInput] = useLocalStorage<DetailsFormInput | undefined>(
    '__warp_details_input',
    undefined
  );

  const [cond, setCond] = useLocalStorage<warp_controller.Condition | undefined>('__warp_condition', undefined);

  const clearJobStorage = useCallback(() => {
    setDetailsInput(undefined);
    setCond(undefined);
  }, [setDetailsInput, setCond]);

  const saveJob = useCallback(
    (job: Job) => {
      const details: DetailsFormInput = {
        reward: demicrofy(job.reward, LUNA.decimals).toString(),
        name: job.info.name,
        message: JSON.stringify(job.info.msgs.map(decodeMsg), null, 2),
      };

      setDetailsInput(details);
      setCond(job.condition);
    },
    [setDetailsInput, setCond]
  );

  return useMemo(
    () => ({
      detailsInput,
      setDetailsInput,
      cond,
      setCond,
      clearJobStorage,
      saveJob,
    }),
    [detailsInput, setDetailsInput, cond, setCond, clearJobStorage, saveJob]
  );
};

export const decodeMsg = (msg: warp_controller.CosmosMsgFor_Empty) => {
  if ('wasm' in msg) {
    if ('execute' in msg.wasm) {
      return {
        wasm: {
          execute: {
            ...msg.wasm.execute,
            msg: fromBase64(msg.wasm.execute.msg),
          },
        },
      };
    }

    if ('instantiate' in msg.wasm) {
      return {
        wasm: {
          instantiate: {
            ...msg.wasm.instantiate,
            msg: fromBase64(msg.wasm.instantiate.msg),
          },
        },
      };
    }

    if ('migrate' in msg.wasm) {
      return {
        wasm: {
          migrate: {
            ...msg.wasm.migrate,
            msg: fromBase64(msg.wasm.migrate.msg),
          },
        },
      };
    }
  }

  return msg;
};

const fromBase64 = (value: string) => {
  return JSON.parse(Buffer.from(value, 'base64').toString());
};
