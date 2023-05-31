import { UIElementProps } from '@terra-money/apps/components';
import { microfy } from '@terra-money/apps/libs/formatting';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { IfConnected } from 'components/if-connected';
import { Throbber } from 'components/primitives';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { useCreateJobTx } from 'tx/useCreateJobTx';
import { LUNA, warp_controller } from 'types';
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

  const connectedWallet = useConnectedWallet();
  const navigate = useNavigate();

  const varsInput = useMemo(() => detailsInput?.template?.vars, [detailsInput]);

  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') ?? 'advanced';

  return (
    <CachedVariablesSession input={varsInput}>
      <div className={styles.root}>
        <IfConnected
          then={
            !connectedWallet ? (
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
                                template = {} as warp_controller.Template,
                                name,
                                reward,
                                message,
                                variables,
                              } = props;
                              const { condition } = template;

                              const msgs = parseMsgs(message);
                              const referenced = filterUnreferencedVariablesInCosmosMsg(variables, msgs, condition!);
                              const vars = hydrateQueryVariablesWithStatics(referenced);

                              const resp = await createJobTx({
                                name,
                                vars,
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
                              const { name, reward, message } = detailsInput;

                              const msgs = parseMsgs(message);
                              const referenced = filterUnreferencedVariablesInCosmosMsg(variables, msgs, cond);
                              const vars = hydrateQueryVariablesWithStatics(referenced);

                              const resp = await createJobTx({
                                name,
                                vars,
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

export const decodeMsgs = (msgs: warp_controller.CosmosMsgFor_Empty[]): string => {
  return JSON.stringify(msgs.map(decodeMsg));
};

export const parseMsgs = (value: string): warp_controller.CosmosMsgFor_Empty[] => {
  const parsed = JSON.parse(value);
  const msgs: warp_controller.CosmosMsgFor_Empty[] = Array.isArray(parsed)
    ? (parsed as warp_controller.CosmosMsgFor_Empty[])
    : [parsed];

  return msgs;
};
