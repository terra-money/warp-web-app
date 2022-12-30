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

type DetailsProps = UIElementProps & {
  selectedVariable: Variable | undefined;
  saveVariable: (variable: Variable) => void;
  deleteVariable: (name: string) => void;
};

export const Details = (props: DetailsProps) => {
  const { className, selectedVariable, saveVariable, deleteVariable } = props;

  let ExprForm = <></>;

  if (selectedVariable && 'query' in selectedVariable) {
    ExprForm = (
      <QueryVariableForm
        className={styles.form}
        selectedVariable={selectedVariable.query}
        renderActions={(state) => {
          const { submitDisabled, querySelector, queryJson, kind, name } = state;

          return (
            <Container direction="row" className={styles.footer}>
              <Button
                variant="primary"
                disabled={submitDisabled}
                onClick={async () => {
                  saveVariable({
                    query: {
                      default_value: {
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
            <Container className={styles.button_container} direction="row">
              <Button
                className={styles.save}
                disabled={submitDisabled}
                onClick={() =>
                  saveVariable({
                    static: {
                      name,
                      default_value: value,
                      kind,
                    },
                  })
                }
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
          const { submitDisabled, name, url, selector, kind } = state;

          return (
            <Container className={styles.button_container} direction="row">
              <Button
                className={styles.save}
                disabled={submitDisabled}
                onClick={() =>
                  saveVariable({
                    external: {
                      name,
                      default_value: {
                        url,
                        selector,
                      },
                      kind,
                    },
                  })
                }
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
        <>{ExprForm}</>
      ) : (
        <Container className={styles.empty}>Select variable for preview.</Container>
      )}
    </Panel>
  );
};