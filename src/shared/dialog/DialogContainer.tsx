import { UIElementProps } from 'shared/components';
import { useDialogContext } from './DialogProvider';

const DialogContainer = (props: UIElementProps) => {
  const { dialogs } = useDialogContext();

  return <>{dialogs}</>;
};

export { DialogContainer };
