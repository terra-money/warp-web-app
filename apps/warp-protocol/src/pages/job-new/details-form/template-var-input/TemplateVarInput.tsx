import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import { TokenInput } from 'pages/balances/token-input/TokenInput';
import { DateInput } from 'pages/dashboard/jobs-widget/inputs/DateInput';
import { useTokens } from '@terra-money/apps/hooks';
import { NumericInput } from 'components/primitives/numeric-input';
import { UIElementProps } from '@terra-money/apps/components';
import { FormControl } from 'components/form-control/FormControl';
import { TextInput } from 'components/primitives/text-input';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';
import { warp_controller } from 'types';

type TemplateVarInputProps = UIElementProps & {
  templateVar: warp_controller.StaticVariable;
  templateVars: warp_controller.StaticVariable[];
  setTemplateVars: (vars: warp_controller.StaticVariable[]) => void;
};

export const TemplateVarInput = (props: TemplateVarInputProps) => {
  const { templateVar, setTemplateVars, templateVars } = props;

  const { tokens } = useTokens();

  const updateTemplateVar = (name: string, updates: Partial<warp_controller.StaticVariable>) => {
    const updatedVars = [...templateVars];
    const idx = templateVars.findIndex((tv) => tv.name === name);
    const prev = updatedVars[idx];
    updatedVars[idx] = { ...prev, ...updates };
    return updatedVars;
  };

  if (['int', 'uint', 'decimal'].includes(templateVar.kind)) {
    return (
      <FormControl label={templateVar.name}>
        <NumericInput
          placeholder={`Type ${templateVar.name} here`}
          margin="none"
          value={templateVar.default_value}
          onChange={(value) => {
            setTemplateVars(
              updateTemplateVar(templateVar.name, {
                default_value: value.target.value,
              })
            );
          }}
        />
      </FormControl>
    );
  }

  if (templateVar.kind === 'amount') {
    return (
      <AmountInput
        label={templateVar.name}
        value={templateVar.default_value && demicrofy(Big(templateVar.default_value) as u<Big>, 6)}
        onChange={(value) =>
          setTemplateVars(
            updateTemplateVar(templateVar.name, {
              default_value: value.target.value ? microfy(value.target.value, 6).toString() : (undefined as any),
            })
          )
        }
      />
    );
  }

  if (templateVar.kind === 'timestamp') {
    const date = templateVar.default_value ? new Date(Number(templateVar.default_value) * 1000) : undefined;

    return (
      <DateInput
        label={templateVar.name}
        placeholder={`Example: "tomorrow at 15:30"`}
        value={date}
        onChange={(v) =>
          setTemplateVars(
            updateTemplateVar(templateVar.name, {
              default_value: Math.floor((v?.getTime() ?? 0) / 1000).toString(),
            })
          )
        }
      />
    );
  }

  if (templateVar.kind === 'asset') {
    return (
      <TokenInput
        label={templateVar.name}
        value={tokens[templateVar.default_value]}
        onChange={(token) => {
          setTemplateVars(
            updateTemplateVar(templateVar.name, {
              default_value: token.key,
            })
          );
        }}
      />
    );
  }

  return (
    <FormControl label={templateVar.name}>
      <TextInput
        placeholder={`Type ${templateVar.name} here`}
        margin="none"
        value={templateVar.default_value}
        onChange={(value) => {
          setTemplateVars(
            updateTemplateVar(templateVar.name, {
              default_value: value.target.value,
            })
          );
        }}
      />
    </FormControl>
  );
};
