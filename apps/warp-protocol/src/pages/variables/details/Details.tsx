import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { Button, Text } from 'components/primitives';
import styles from './Details.module.sass';
import { Variable } from '../useVariableStorage';
import { QueryVariableForm } from './query/QueryVariableForm';
import { StaticVariableForm } from './static/StaticVariableForm';
import { ExternalVariableForm } from './external/ExternalVariableForm';
import { variableName } from 'utils/variable';
import { encodeQuery } from 'utils';
import { VariablePill } from '../variable-pill/VariablePill';

type DetailsProps = UIElementProps & {
  selectedVariable: Variable | undefined;
  updateVariable: (variable: Variable) => void;
  deleteVariable: (name: string) => void;
};

export const Details = (props: DetailsProps) => {
  const { className, selectedVariable, updateVariable, deleteVariable } = props;

  let ExprForm = <></>;

  if (selectedVariable && 'query' in selectedVariable) {
    ExprForm = (
      <QueryVariableForm
        className={styles.form}
        selectedVariable={selectedVariable.query}
        renderActions={(state) => {
          const { submitDisabled, querySelector, queryJson, kind, name, template } = state;

          return (
            <Container direction="row" className={styles.footer}>
              <Button
                variant="primary"
                className={styles.save}
                disabled={submitDisabled}
                onClick={async () => {
                  updateVariable({
                    query: {
                      reinitialize: false,
                      template,
                      init_fn: {
                        selector: querySelector,
                        query: encodeQuery(queryJson),
                      },
                      kind,
                      name,
                    },
                  });
                }}
              >
                Save
              </Button>
              <Button variant="danger" onClick={() => deleteVariable(variableName(selectedVariable))}>
                Delete
              </Button>
            </Container>
          );
        }}
      />
    );
  }

  if (selectedVariable && 'static' in selectedVariable) {
    ExprForm = (
      <StaticVariableForm
        className={styles.form}
        selectedVariable={selectedVariable.static}
        renderActions={(state) => {
          const { submitDisabled, name, value, kind } = state;

          return (
            <Container className={styles.footer} direction="row">
              <Button
                variant="primary"
                className={styles.save}
                disabled={submitDisabled}
                onClick={() => {
                  updateVariable({
                    static: {
                      name,
                      value,
                      kind,
                    },
                  });
                }}
              >
                Save
              </Button>
              <Button variant="danger" onClick={() => deleteVariable(variableName(selectedVariable))}>
                Delete
              </Button>
            </Container>
          );
        }}
      />
    );
  }

  if (selectedVariable && 'external' in selectedVariable) {
    ExprForm = (
      <ExternalVariableForm
        className={styles.form}
        selectedVariable={selectedVariable.external}
        renderActions={(state) => {
          const { submitDisabled, name, url, selector, kind, body, method } = state;

          return (
            <Container className={styles.footer} direction="row">
              <Button
                variant="primary"
                className={styles.save}
                disabled={submitDisabled}
                onClick={() => {
                  updateVariable({
                    external: {
                      name,
                      reinitialize: false,
                      init_fn: {
                        url,
                        selector,
                        body,
                        method,
                      },
                      kind,
                    },
                  });
                }}
              >
                Save
              </Button>
              <Button variant="danger" onClick={() => deleteVariable(variableName(selectedVariable))}>
                Delete
              </Button>
            </Container>
          );
        }}
      />
    );
  }

  return (
    <Panel className={classNames(styles.root, className)}>
      <Text variant="label" className={styles.title}>
        Variable preview
      </Text>
      {selectedVariable ? (
        <>
          <Container className={styles.title_container}>
            <Text variant="heading1" className={styles.title}>
              {variableName(selectedVariable)}
            </Text>
            <VariablePill className={styles.pill} variable={selectedVariable} />
          </Container>
          {ExprForm}
        </>
      ) : (
        <Container className={styles.empty}>Select variable for preview.</Container>
      )}
    </Panel>
  );
};
