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
import { useJobStorage } from './useJobStorage';
import { filterUnreferencedVariables, hydrateQueryVariablesWithStatics } from 'utils/variable';
import { VariableDrawer } from './variable-drawer/VariableDrawer';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { CachedVariablesSession } from './CachedVariablesSession';

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
                <VariableDrawer />
                <Routes>
                  <Route
                    path="/details"
                    element={
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

                            const msgs = encodeMsgs(message);
                            const referenced = filterUnreferencedVariables(variables, message, condition!);
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
                    }
                  />
                  <Route
                    path="/condition"
                    element={
                      <ConditionForm
                        className={styles.condition}
                        loading={txResult.loading}
                        onNext={async (props) => {
                          if (detailsInput) {
                            const { cond, variables } = props;
                            const { name, reward, message } = detailsInput;

                            const msgs = encodeMsgs(message);
                            const vars = filterUnreferencedVariables(variables, message, cond);

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
                    }
                  />
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

const encodeMsgs = (value: string): warp_controller.CosmosMsgFor_Empty[] => {
  const parsed = JSON.parse(value);
  const msgs: warp_controller.CosmosMsgFor_Empty[] = Array.isArray(parsed)
    ? (parsed as warp_controller.CosmosMsgFor_Empty[])
    : [parsed];

  return msgs.map(encodeMsg);
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
