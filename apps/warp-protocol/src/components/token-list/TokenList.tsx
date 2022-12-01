import { useCallback, useMemo, useState } from 'react';
import { Text, Throbber } from 'components/primitives';
import { SearchTextInput } from 'components/search-text-input';
import { FixedSizeList } from 'react-window';
import { useTokens, DialogProps, useDialog } from '@terra-money/apps/hooks';
import { Token, CW20Token } from '@terra-money/apps/types';
import classNames from 'classnames';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import { CW20Addr } from '@terra-money/apps/types';
import { ListData } from './ListData';
import { ListItem } from './ListItem';
import styles from './TokenList.module.sass';
import { pluralize } from '@terra-money/apps/utils';
import { useCW20TokenQuery } from 'queries/useCW20TokenQuery';
import { Container } from '@terra-money/apps/components';

const isMatchingToken = (token: Token, searchText: string): boolean => {
  if (searchText?.length === 0) {
    return true;
  }

  const { symbol = '', name = '' } = token;

  return (
    symbol.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
    name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
  );
};

const TokenListDialog = (props: DialogProps<void, Token>) => {
  const { closeDialog } = props;

  const [searchText, setSearchText] = useState('');

  const { data: cw20Token, isLoading: cw20TokenLoading } = useCW20TokenQuery(searchText as CW20Addr);

  const { tokens, isLoading } = useTokens();

  const onSearchTextChanged = useCallback(
    (text: string) => {
      setSearchText(text);
    },
    [setSearchText]
  );

  const tokenList = useMemo(() => {
    return Object.values(tokens ?? {})
      .filter((t) => t.symbol !== undefined && isMatchingToken(t, searchText))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [tokens, searchText]);

  const listData = useMemo<ListData>(() => {
    const onSelectionChanged = (token: Token) => {
      closeDialog(token);
    };

    if (tokenList.length === 0 && cw20Token) {
      const token: CW20Token = {
        type: 'cw20',
        key: cw20Token.tokenAddr,
        token: cw20Token.tokenAddr,
        name: cw20Token.name,
        symbol: cw20Token.symbol,
        decimals: cw20Token.decimals,
        icon: '',
        protocol: '',
      };
      return {
        tokens: [token],
        onSelectionChanged,
      };
    }

    return {
      tokens: tokenList,
      onSelectionChanged,
    };
  }, [tokenList, cw20Token, closeDialog]);

  return (
    <Dialog>
      <DialogHeader title="Add token" onClose={() => closeDialog(undefined)}>
        <SearchTextInput
          className={styles.searchTextInput}
          placeholder="Search for a token"
          searchText={searchText}
          onChange={onSearchTextChanged}
        />
      </DialogHeader>
      <DialogBody className={styles.container}>
        <Container
          className={classNames(styles.columns, {
            [styles.hide]: isLoading,
          })}
          direction="row"
        >
          <Text variant="label">{`Displaying ${listData.tokens.length} ${pluralize(
            'token',
            listData.tokens.length
          )}`}</Text>
          <Text variant="label">Balance</Text>
        </Container>
        {(isLoading || cw20TokenLoading) && <Throbber className={styles.throbber} />}
        {isLoading === false && cw20TokenLoading === false && (
          <FixedSizeList<ListData>
            className={styles.list}
            itemData={listData}
            height={300}
            width={520}
            itemSize={60}
            itemCount={listData.tokens.length}
            overscanCount={5}
          >
            {ListItem}
          </FixedSizeList>
        )}
      </DialogBody>
    </Dialog>
  );
};

export const useTokenListDialog = () => {
  return useDialog(TokenListDialog);
};
