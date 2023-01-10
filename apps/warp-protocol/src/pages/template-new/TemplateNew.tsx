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
import { filterUnreferencedVariables } from 'utils/variable';
import { DetailsForm } from './DetailsForm';
import { ConditionBuilder } from 'pages/job-new/condition-builder/ConditionBuilder';
import { useJobStorage } from 'pages/job-new/useJobStorage';
import { VariableDrawer } from 'pages/job-new/variable-drawer/VariableDrawer';
import { filterEmptyCond } from 'pages/job-new/condition-form/ConditionForm';
import { warp_controller } from 'types';
import { useSearchParams } from 'react-router-dom';

type TemplateNewProps = UIElementProps & {};

export const TemplateNew = (props: TemplateNewProps) => {
  const { className } = props;

  const navigate = useNavigate();

  const [input, formState] = useTemplateNewForm();

  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') ?? 'advanced';

  const { name, msg, submitDisabled, formattedStr, vars, kind } = formState;

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
          <Route path="*" element={<Navigate to="/template-new/details?mode=basic" replace />} />
        </Routes>
      </>
      <Footer>
        <Button
          variant="primary"
          loading={createTemplateTxResult.loading}
          disabled={submitDisabled}
          onClick={async () => {
            const res = await createTemplateTx({
              formatted_str: formattedStr,
              msg,
              kind,
              condition: filterEmptyCond(cond ?? ({} as warp_controller.Condition)),
              vars: filterUnreferencedVariables(vars, msg),
              name,
            });

            if (res.success) {
              navigate(-1);
            }
          }}
        >
          Save
        </Button>
        {!inConditionTab && kind === 'msg' && mode === 'advanced' && (
          <Button gutters="large" variant="secondary" onClick={() => navigate('/template-new/condition')}>
            Add condition
          </Button>
        )}
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Footer>
    </Container>
  );
};
