import { IfConnected } from 'components/if-connected';
import { NotConnected } from 'components/not-connected';
import { Templates } from './Templates';

export const TemplatesPage = () => {
  return <IfConnected then={<Templates />} else={<NotConnected />} />;
};
