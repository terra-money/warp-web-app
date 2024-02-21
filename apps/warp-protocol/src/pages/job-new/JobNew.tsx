import { UIElementProps } from '@terra-money/apps/components';
import { useLocalWallet } from '@terra-money/apps/hooks';
import { IfConnected } from 'components/if-connected';
import { Throbber } from 'components/primitives';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { useCreateJobTx } from 'tx/useCreateJobTx';
import { warp_resolver } from '@terra-money/warp-sdk';
import { ConditionForm } from './condition-form/ConditionForm';
import { DetailsForm } from './details-form/DetailsForm';
import styles from './JobNew.module.sass';
import { decodeMsg, useJobStorage } from './useJobStorage';
import { VariableDrawer } from './variable-drawer/VariableDrawer';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { CachedVariablesSession } from './CachedVariablesSession';
import { DeveloperForm } from './developer-form/DeveloperForm';
import { SummaryForm } from './summary-form/SummaryForm';

type JobNewProps = UIElementProps & {};

export const JobNew = (props: JobNewProps) => {
  const { detailsInput, setDetailsInput, setCond } = useJobStorage();

  const [txResult] = useCreateJobTx();

  const localWallet = useLocalWallet();
  const navigate = useNavigate();

  const varsInput = useMemo(() => detailsInput?.template?.vars, [detailsInput]);

  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') ?? 'advanced';

  return (
    <CachedVariablesSession input={varsInput}>
      <div className={styles.root}>
        <IfConnected
          then={
            !localWallet.connectedWallet ? (
              <Throbber className={styles.loading} />
            ) : (
              <>
                <Routes>
                  <Route
                    path="/details"
                    element={
                      <>
                        <VariableDrawer />
                        <DetailsForm
                          mode={mode}
                          className={styles.details}
                          loading={txResult.loading}
                          detailsInput={detailsInput}
                          onNext={async (props) => {
                            setDetailsInput(props);
                            navigate('/job-new/condition');
                          }}
                        />
                      </>
                    }
                  />
                  <Route
                    path="/condition"
                    element={
                      <>
                        <VariableDrawer />
                        <ConditionForm
                          className={styles.condition}
                          loading={txResult.loading}
                          onNext={async (props) => {
                            setCond(props.cond);
                            navigate('/job-new/summary');
                          }}
                        />
                      </>
                    }
                  />
                  <Route
                    path="/summary"
                    element={
                      <>
                        <VariableDrawer />
                        <SummaryForm className={styles.summary} />
                      </>
                    }
                  />
                  <Route path="/developer" element={<DeveloperForm className={styles.developer} />} />
                  <Route path="*" element={<Navigate to="/job-new/details" replace />} />
                </Routes>
              </>
            )
          }
        />
      </div>
    </CachedVariablesSession>
  );
};

export const decodeMsgs = (msgs: warp_resolver.WarpMsg[]) => {
  return msgs.map(decodeMsg);
};

export const encodeMsgs = (value: string): warp_resolver.WarpMsg[] => {
  const msgs = parseMsgs(value);

  return msgs.map(encodeMsg);
};

export const parseMsgs = (value: string): warp_resolver.WarpMsg[] => {
  const parsed = JSON.parse(value);
  const msgs: warp_resolver.WarpMsg[] = Array.isArray(parsed) ? (parsed as warp_resolver.WarpMsg[]) : [parsed];

  return msgs;
};

export const encodeMsg = (inputMsg: warp_resolver.WarpMsg): warp_resolver.WarpMsg => {
  if (!('generic' in inputMsg)) {
    return inputMsg;
  }

  const input = inputMsg.generic;

  if (!('wasm' in input)) {
    return inputMsg;
  }

  let msg = input.wasm;

  if ('execute' in msg) {
    msg.execute.msg = base64encode(msg.execute.msg);
  }

  if ('instantiate' in msg) {
    msg.instantiate.msg = base64encode(msg.instantiate.msg);
  }

  if ('migrate' in msg) {
    msg.migrate.msg = base64encode(msg.migrate.msg);
  }

  return { generic: { wasm: msg } };
};

const base64encode = (input: string): string => {
  return Buffer.from(JSON.stringify(JSON.parse(JSON.stringify(input)))).toString('base64');
};
