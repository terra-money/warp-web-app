import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/dialog';
import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { Button } from 'components/primitives';
import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import { useWithdrawFundsTx } from 'tx';
import Big from 'big.js';
import { Token } from 'types';
import { useWithdrawFundsForm } from './useWithdrawFundsForm';
import { u } from '@terra-money/apps/types';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';

interface WithdrawFundsProps {
  token: Token;
  balance: u<Big>;
}

const WithdrawFundsDialog = (props: DialogProps<WithdrawFundsProps>) => {
  const { token, balance, closeDialog } = props;

  const [input, { amount, amountValid, amountError, submitDisabled }] = useWithdrawFundsForm(token, balance);

  const [txResult, tx] = useWithdrawFundsTx();

  return (
    <Dialog>
      <DialogHeader title="Withdraw funds" onClose={() => closeDialog()} />
      <DialogBody>
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
                amount: demicrofy(value, token.decimals).toString(),
              });
            }
          }}
          error={amountError}
          balance={balance}
          token={token}
          valid={amountValid}
        />
      </DialogBody>
      <DialogFooter>
        <Button
          loading={txResult.loading}
          variant="primary"
          disabled={submitDisabled}
          onClick={async () => {
            if (token && amount) {
              const response = await tx({
                token: token,
                amount: microfy(Big(amount), token.decimals),
              });
              if (response?.success) {
                closeDialog();
              }
            }
          }}
        >
          Withdraw
        </Button>
        <Button variant="secondary" onClick={() => closeDialog()}>
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useWithdrawFundsDialog = () => {
  return useDialog<WithdrawFundsProps>(WithdrawFundsDialog);
};
