import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/dialog';
import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { useAddFundsForm } from './useAddFundsForm';
import { Button } from 'components/primitives';
import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import Big from 'big.js';
import { Token } from '@terra-money/apps/types';
import { useAddFundsTx } from 'tx';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';
import { TokenInput } from './token-input/TokenInput';

interface AddFundsProps {
  token?: Token;
}

const AddFundsDialog = (props: DialogProps<AddFundsProps>) => {
  const { token: selectedToken, closeDialog } = props;

  const [input, { token, balance, balanceLoading, amount, amountValid, amountError, submitDisabled }] =
    useAddFundsForm(selectedToken);

  const [txResult, tx] = useAddFundsTx();

  return (
    <Dialog>
      <DialogHeader title="Deposit funds" onClose={() => closeDialog()} />
      <DialogBody>
        {selectedToken === undefined && (
          <TokenInput
            label="Token"
            value={token}
            onChange={(token) => {
              input({ token });
            }}
          />
        )}
        <AmountInput
          label="Amount"
          value={amount}
          onChange={(value) =>
            input({
              amount: value.target.value,
            })
          }
          onBalanceClick={(value) => {
            if (token) {
              input({
                amount: demicrofy(value, token?.decimals).toString(),
              });
            }
          }}
          error={amountError}
          balance={balance}
          balanceLoading={balanceLoading}
          token={token}
          valid={amountValid}
        />
      </DialogBody>
      <DialogFooter>
        <Button
          variant="primary"
          loading={txResult.loading}
          disabled={submitDisabled}
          onClick={async () => {
            if (token && amount) {
              const response = await tx({
                token: token,
                amount: microfy(Big(amount), token.decimals),
              });
              if (response.code !== 0) {
                closeDialog();
              }
            }
          }}
        >
          Add
        </Button>
        <Button variant="secondary" onClick={() => closeDialog()}>
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useAddFundsDialog = () => {
  return useDialog<AddFundsProps>(AddFundsDialog);
};
