import { UIElementProps } from '@terra-money/apps/components';
import { microfy } from '@terra-money/apps/libs/formatting';
import { useLocalWallet } from '@terra-money/apps/hooks';
import { IfConnected } from 'components/if-connected';
import { Throbber } from 'components/primitives';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { useCreateJobTx } from 'tx/useCreateJobTx';
import { LUNA, warp_controller, warp_resolver } from 'types';
import { ConditionForm } from './condition-form/ConditionForm';
import { DetailsForm } from './details-form/DetailsForm';
import styles from './JobNew.module.sass';
import { decodeMsg, useJobStorage } from './useJobStorage';
import { hydrateQueryVariablesWithStatics } from 'utils/variable';
import { VariableDrawer } from './variable-drawer/VariableDrawer';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { CachedVariablesSession } from './CachedVariablesSession';
import { DeveloperForm } from './developer-form/DeveloperForm';
import { filterUnreferencedVariablesInCosmosMsg } from 'utils/msgs';

type JobNewProps = UIElementProps & {};

export const JobNew = (props: JobNewProps) => {
  const { detailsInput, setDetailsInput } = useJobStorage();

  const [txResult, createJobTx] = useCreateJobTx();

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
                            const { template } = props;

                            if (mode === 'advanced' || !template?.condition) {
                              setDetailsInput(props);
                              navigate('/job-new/condition');
                            } else {
                              const {
                                template = {} as warp_resolver.Template,
                                name,
                                reward,
                                message,
                                description,
                                variables,
                              } = props;
                              const { condition } = template;

                              const msgs = parseMsgs(message);
                              const referenced = filterUnreferencedVariablesInCosmosMsg(variables, msgs, condition!);
                              const vars = hydrateQueryVariablesWithStatics(referenced);

                              const resp = await createJobTx({
                                name,
                                vars,
                                description,
                                reward: microfy(reward, LUNA.decimals),
                                msgs,
                                condition: condition!,
                              });

                              if (resp.success) {
                                navigate('/jobs');
                              }
                            }
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
                            if (detailsInput) {
                              const { cond, variables } = props;
                              const { name, reward, message, description } = detailsInput;

                              const msgs = parseMsgs(message);
                              const referenced = filterUnreferencedVariablesInCosmosMsg(variables, msgs, cond);
                              const vars = hydrateQueryVariablesWithStatics(referenced);

                              const resp = await createJobTx({
                                name,
                                vars,
                                description,
                                reward: microfy(reward, LUNA.decimals),
                                msgs,
                                condition: cond,
                              });

                              if (resp.success) {
                                navigate('/jobs');
                              }
                            }
                          }}
                        />
                      </>
                    }
                  />
                  <Route path="/developer" element={<DeveloperForm className={styles.developer} />} />
                  <Route path="*" element={<Navigate to="/job-new/details?mode=basic" replace />} />
                </Routes>
              </>
            )
          }
        />
      </div>
    </CachedVariablesSession>
  );
};

export const decodeMsgs = (msgs: string[]) => {
  return msgs.map((m) => JSON.parse(m)).map(decodeMsg);
};

export const encodeMsgs = (value: string): warp_controller.CosmosMsgFor_Empty[] => {
  const msgs = parseMsgs(value);

  return msgs.map(encodeMsg);
};

export const parseMsgs = (value: string): warp_controller.CosmosMsgFor_Empty[] => {
  const parsed = JSON.parse(value);
  const msgs: warp_controller.CosmosMsgFor_Empty[] = Array.isArray(parsed)
    ? (parsed as warp_controller.CosmosMsgFor_Empty[])
    : [parsed];

  return msgs;
};

const encodeMsg = (input: warp_controller.CosmosMsgFor_Empty): warp_controller.CosmosMsgFor_Empty => {
  if (!('wasm' in input)) {
    return input;
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

  return { wasm: msg };
};

const base64encode = (input: string): string => {
  return Buffer.from(JSON.stringify(JSON.parse(JSON.stringify(input)))).toString('base64');
};
