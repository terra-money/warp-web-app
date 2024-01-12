import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import { isEmpty } from 'lodash';
import { Job } from 'types/job';
import { DetailsFormInput } from './details-form/useDetailsForm';
import { useCachedVariables } from './useCachedVariables';
import { warp_resolver } from '@terra-money/warp-sdk';
import { useChainSuffix } from '@terra-money/apps/hooks';
import { Template } from 'types';

export const useJobStorage = () => {
  const detailsInputKey = useChainSuffix('__warp_details_input');
  const [detailsInput, setDetailsInput] = useLocalStorage<DetailsFormInput | undefined>(detailsInputKey, {} as any);

  const conditionKey = useChainSuffix('__warp_condition');
  const [cond, setCond] = useLocalStorage<warp_resolver.Condition | undefined>(conditionKey, {} as any);

  const { clearAll: clearAllCachedVariables, setVariables } = useCachedVariables();

  const clearJobStorage = useCallback(() => {
    setDetailsInput({} as any);
    setCond({} as any);
    clearAllCachedVariables();
  }, [setDetailsInput, setCond, clearAllCachedVariables]);

  const saveJob = useCallback(
    (job: Job) => {
      const details: DetailsFormInput = {
        durationDays: job.info.duration_days.toString(),
        name: job.info.name,
        description: job.info.description,
        message: JSON.stringify(job.msgs, null, 2),
        recurring: job.info.recurring,
      };

      setDetailsInput(details);
      setCond(job.condition);
      setVariables(job.info.vars);
    },
    [setDetailsInput, setCond, setVariables]
  );

  const setJobTemplate = useCallback(
    (template: Template) => {
      const details: DetailsFormInput = {
        durationDays: '',
        description: '',
        name: '',
        message: JSON.stringify(template.msg, null, 2),
        template,
        recurring: false,
      };

      setDetailsInput(details);
      setCond(template.condition ?? ({} as any));
    },
    [setDetailsInput, setCond]
  );
  return useMemo(
    () => ({
      detailsInput: isEmpty(detailsInput) ? undefined : detailsInput,
      setDetailsInput,
      cond: isEmpty(cond) ? undefined : cond,
      setCond,
      clearJobStorage,
      setJobTemplate,
      saveJob,
    }),
    [detailsInput, setDetailsInput, cond, setCond, clearJobStorage, saveJob, setJobTemplate]
  );
};

export const decodeMsg = (inputMsg: warp_resolver.WarpMsg) => {
  if (!('generic' in inputMsg)) {
    return inputMsg;
  }

  const msg = inputMsg.generic;

  if ('wasm' in msg) {
    if ('execute' in msg.wasm) {
      return {
        generic: {
          wasm: {
            execute: {
              ...msg.wasm.execute,
              msg: safeFromBase64(msg.wasm.execute.msg),
            },
          },
        },
      };
    }

    if ('instantiate' in msg.wasm) {
      return {
        generic: {
          wasm: {
            instantiate: {
              ...msg.wasm.instantiate,
              msg: safeFromBase64(msg.wasm.instantiate.msg),
            },
          },
        },
      };
    }

    if ('migrate' in msg.wasm) {
      return {
        generic: {
          wasm: {
            migrate: {
              ...msg.wasm.migrate,
              msg: safeFromBase64(msg.wasm.migrate.msg),
            },
          },
        },
      };
    }
  }

  return inputMsg;
};

export const fromBase64 = (value: string) => {
  return JSON.parse(Buffer.from(value, 'base64').toString());
};

export const safeFromBase64 = (value: string) => {
  try {
    return JSON.parse(Buffer.from(value, 'base64').toString());
  } catch (err) {
    return value;
  }
};
