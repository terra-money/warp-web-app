import { UIElementProps } from '@terra-money/apps/components';
import { Pill } from 'components/primitives/pill/Pill';
import { Variable } from '../useVariableStorage';

const pillColor = (variable: Variable) => {
  if ('static' in variable) {
    return 'purple';
  }

  if ('external' in variable) {
    return 'yellow';
  }

  if ('query' in variable) {
    return 'blue';
  }

  return 'green';
};

const pillContent = (variable: Variable) => {
  if ('static' in variable) {
    return 'Static';
  }

  if ('external' in variable) {
    return 'External';
  }

  if ('query' in variable) {
    return 'Query';
  }

  return undefined;
};

type VariablePillProps = UIElementProps & {
  variable: Variable;
};

export const VariablePill = (props: VariablePillProps) => {
  const { className, variable } = props;

  return (
    <Pill className={className} color={pillColor(variable)}>
      {pillContent(variable)}
    </Pill>
  );
};
