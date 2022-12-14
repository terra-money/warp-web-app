import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import { u } from '@terra-money/apps/types';
import { capitalize } from '@mui/material';
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

type TemplateVar = warp_controller.TemplateVar & { value: string };

type TemplateVarInputProps = UIElementProps & {
  templateVar: TemplateVar;
  templateVars: TemplateVar[];
  setTemplateVars: (vars: TemplateVar[]) => void;
};

export const TemplateVarInput = (props: TemplateVarInputProps) => {
  const { templateVar, setTemplateVars, templateVars } = props;

  const { tokens } = useTokens();

  const updateTemplateVar = (name: string, updates: Partial<TemplateVar>) => {
    const updatedVars = [...templateVars];
    const idx = templateVars.findIndex((tv) => tv.name === name);
    const prev = updatedVars[idx];
    updatedVars[idx] = { ...prev, ...updates };
    return updatedVars;
  };

  if (['int', 'uint', 'decimal'].includes(templateVar.kind)) {
    return (
      <FormControl label={capitalize(templateVar.name)}>
        <NumericInput
          placeholder={`Type ${templateVar.name} here`}
          margin="none"
          value={templateVar.value}
          onChange={(value) => {
            setTemplateVars(
              updateTemplateVar(templateVar.name, {
                value: value.target.value,
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
        label={capitalize(templateVar.name)}
        value={templateVar.value && demicrofy(Big(templateVar.value) as u<Big>, 6)}
        onChange={(value) =>
          setTemplateVars(
            updateTemplateVar(templateVar.name, {
              value: value.target.value ? microfy(value.target.value, 6).toString() : (undefined as any),
            })
          )
        }
      />
    );
  }

  if (templateVar.kind === 'timestamp') {
    const date = templateVar.value ? new Date(Number(templateVar.value) * 1000) : undefined;

    return (
      <DateInput
        label={capitalize(templateVar.name)}
        placeholder={`Example: "tomorrow at 15:30"`}
        value={date}
        onChange={(v) =>
          setTemplateVars(
            updateTemplateVar(templateVar.name, {
              value: Math.floor((v?.getTime() ?? 0) / 1000).toString(),
            })
          )
        }
      />
    );
  }

  if (templateVar.kind === 'asset') {
    return (
      <TokenInput
        label={capitalize(templateVar.name)}
        value={tokens[templateVar.value]}
        onChange={(token) => {
          setTemplateVars(
            updateTemplateVar(templateVar.name, {
              value: token.key,
            })
          );
        }}
      />
    );
  }

  return (
    <FormControl label={capitalize(templateVar.name)}>
      <TextInput
        placeholder={`Type ${templateVar.name} here`}
        margin="none"
        value={templateVar.value}
        onChange={(value) => {
          setTemplateVars(
            updateTemplateVar(templateVar.name, {
              value: value.target.value,
            })
          );
        }}
      />
    </FormControl>
  );
};
