const test = {};

export default test;
// import { useConnectedWallet, useWallet } from '@terra-money/wallet-kit';
// import { UIElementProps } from '@terra-money/apps/components';
// import { Text } from 'components/primitives/text';
// import styles from './NetworkGuard.module.sass';
// import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
// import { Button } from 'components/primitives';
// import { useCallback } from 'react';

// export const NetworkGuard = (props: UIElementProps) => {
//   const { children } = props;

//   const { network } = useWallet();

//   const connectedWallet = useConnectedWallet();

//   const refresh = useCallback(() => window.location.reload(), []);

//   if (connectedWallet && network.name === 'classic') {
//     return (
//       <Dialog className={styles.root}>
//         <DialogHeader title="Wrong Network" onClose={refresh} />
//         <DialogBody className={styles.body}>
//           <Text variant="label" className={styles.description}>
//             Warp Protocol is currently operating only on Terra network.
//           </Text>
//           <Text variant="label" className={styles.transaction}>
//             <span>Change your network to</span>&nbsp;<span className={styles.testnet}>mainnet</span>&nbsp;
//             <span>to proceed</span>.
//           </Text>
//         </DialogBody>
//         <DialogFooter>
//           <Button variant="secondary" className={styles.btn} onClick={refresh}>
//             Refresh app
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     );
//   }

//   return <>{children}</>;
// };
