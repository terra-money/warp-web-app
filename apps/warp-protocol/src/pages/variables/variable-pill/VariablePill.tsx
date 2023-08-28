import { UIElementProps } from '@terra-money/apps/components';
import { Pill } from 'components/primitives/pill/Pill';
import { warp_resolver } from '@terra-money/warp-sdk';

const pillColor = (variable: warp_resolver.Variable) => {
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

const pillContent = (variable: warp_resolver.Variable) => {
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
  variable: warp_resolver.Variable;
};

export const VariablePill = (props: VariablePillProps) => {
  const { className, variable } = props;

  return (
    <Pill className={className} color={pillColor(variable)}>
      {pillContent(variable)}
    </Pill>
  );
};
