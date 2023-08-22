import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Button, Link, Text } from 'components/primitives';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { Footer } from '../job-new/footer/Footer';
import styles from './TemplateNew.module.sass';
import { useCreateTemplateTx } from 'tx';
import { useTemplateNewForm } from './useTemplateNewForm';
import { useEffect } from 'react';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';
import { formattedStringVariables, variableName } from 'utils/variable';
import { DetailsForm } from './DetailsForm';
import { uniqBy } from 'lodash';
import { ConditionBuilder } from 'pages/job-new/condition-builder/ConditionBuilder';
import { useJobStorage } from 'pages/job-new/useJobStorage';
import { VariableDrawer } from 'pages/job-new/variable-drawer/VariableDrawer';
import { filterEmptyCond } from 'pages/job-new/condition-form/ConditionForm';
import { warp_resolver } from '@terra-money/warp-sdk';
import { CachedVariablesSession } from 'pages/job-new/CachedVariablesSession';
import { filterUnreferencedVariablesInCosmosMsg } from 'utils/msgs';
import { parseMsgs } from 'pages/job-new/JobNew';

type TemplateNewProps = UIElementProps & {};

export const TemplateNew = (props: TemplateNewProps) => {
  const { className } = props;

  const navigate = useNavigate();

  const [input, formState] = useTemplateNewForm();

  const { name, msg, submitDisabled, formattedStr, vars } = formState;

  const [createTemplateTxResult, createTemplateTx] = useCreateTemplateTx();

  const { variables } = useCachedVariables();

  useEffect(() => {
    input({ vars: variables });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables]);

  const location = useLocation();

  const inConditionTab = location.pathname.endsWith('/condition');

  const { cond, setCond } = useJobStorage();

  return (
    <CachedVariablesSession>
      <Container direction="column" className={classNames(styles.root, className)}>
        <VariableDrawer />
        <Container className={styles.title_container}>
          <Text variant="heading1" className={styles.title}>
            New template
          </Text>
          <Link className={styles.back} to={-1}>
            Back
          </Link>
          <Text className={styles.description} variant="label">
            Below you may enter a job template, composed of a string in a human readable text format with arbitrary
            variable definitions, and the accompaying JSON message. Job templates can include condition defintions.
          </Text>
        </Container>
        <>
          <Routes>
            <Route path="/details" element={<DetailsForm formState={formState} input={input} />} />
            <Route path="/condition" element={<ConditionBuilder cond={cond} setCond={setCond} />} />
            <Route path="*" element={<Navigate to="/template-new/details" replace />} />
          </Routes>
        </>
        <Footer>
          <Button
            variant="primary"
            loading={createTemplateTxResult.loading}
            disabled={submitDisabled}
            onClick={async () => {
              const condition = filterEmptyCond(cond ?? ({} as warp_resolver.Condition));
              const msgs = parseMsgs(msg);
              const res = await createTemplateTx({
                formatted_str: formattedStr,
                msg,
                condition,
                vars: extractUsedVariables(formattedStr, msgs, vars, condition),
                name,
              });

              if (res.code !== 0) {
                navigate('/templates');
              }
            }}
          >
            Save
          </Button>
          {!inConditionTab && (
            <Button gutters="large" variant="secondary" onClick={() => navigate('/template-new/condition')}>
              Add condition
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Footer>
      </Container>
    </CachedVariablesSession>
  );
};

const extractUsedVariables = (
  formattedStr: string,
  msgs: warp_resolver.CosmosMsgFor_Empty[],
  vars: warp_resolver.Variable[],
  condition?: warp_resolver.Condition
) => {
  return uniqBy(
    [...formattedStringVariables(formattedStr, vars), ...filterUnreferencedVariablesInCosmosMsg(vars, msgs, condition)],
    (v) => variableName(v)
  );
};
