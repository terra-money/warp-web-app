import { Drawer } from '@mui/material';
import { UIElementProps } from '@terra-money/apps/components';
import { microfy } from '@terra-money/apps/libs/formatting';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { IfConnected } from 'components/if-connected';
import { Text, Throbber } from 'components/primitives';
import { useEditVariableDialog } from 'pages/variables/dialogs/VariableDialog';
import { Nav } from 'pages/variables/nav/Nav';
import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { useCreateJobTx } from 'tx/useCreateJobTx';
import { LUNA, warp_controller } from 'types';
import { ConditionForm } from './condition-form/ConditionForm';
import { DetailsForm } from './details-form/DetailsForm';
import { Header } from './header/Header';
import styles from './JobNew.module.sass';
import { useJobStorage } from './useJobStorage';
import { useCachedVariables } from './useCachedVariables';

type JobNewProps = UIElementProps & {};

export const JobNew = (props: JobNewProps) => {
  const { detailsInput, setDetailsInput } = useJobStorage();

  const [txResult, createJobTx] = useCreateJobTx();

  const connectedWallet = useConnectedWallet();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const onToggleDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  const { variables, saveVariable } = useCachedVariables();

  const openEditVariableDialog = useEditVariableDialog();

  return (
    <div className={styles.root}>
      <IfConnected
        then={
          !connectedWallet ? (
            <Throbber className={styles.loading} />
          ) : (
            <>
              <Header />
              <Drawer
                variant="persistent"
                anchor="right"
                open={drawerOpen}
                classes={{
                  paper: styles.drawer,
                }}
              >
                <Text onClick={onToggleDrawer} variant="label" className={styles.drawer_toggle}>
                  {drawerOpen ? 'Collapse' : 'Variables'}
                </Text>
                <Nav
                  className={styles.variables}
                  variables={variables}
                  saveVariable={(v) => saveVariable(v)}
                  onVariableClick={async (v) => {
                    const resp = await openEditVariableDialog(v);

                    if (resp) {
                      saveVariable(resp);
                    }
                  }}
                />
              </Drawer>
              <Routes>
                <Route
                  path="/job-details"
                  element={
                    <DetailsForm
                      className={styles.details}
                      detailsInput={detailsInput}
                      onNext={(props) => {
                        setDetailsInput(props);
                        navigate('/job-new/create-condition');
                      }}
                    />
                  }
                />
                <Route
                  path="/create-condition"
                  element={
                    <ConditionForm
                      className={styles.condition}
                      loading={txResult.loading}
                      onNext={async (props) => {
                        if (detailsInput) {
                          const { name, reward, message } = detailsInput;

                          const msgs = encodeMsgs(message);

                          const resp = await createJobTx({
                            name,
                            vars: [],
                            reward: microfy(reward, LUNA.decimals),
                            msgs,
                            condition: props.cond,
                          });

                          if (resp.success) {
                            navigate('/jobs');
                          }
                        }
                      }}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/job-new/job-details" replace />} />
              </Routes>
            </>
          )
        }
      />
    </div>
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
