import { useCallback, useMemo, useState } from 'react';
import { Button, Text, Throbber } from 'components/primitives';
import { SearchTextInput } from 'components/search-text-input';
import { FixedSizeList } from 'react-window';
import { useTokens, DialogProps, useDialog } from 'shared/hooks';
import { Token, CW20Token } from 'shared/types';
import { uniqBy, sortBy, isEqual } from 'lodash';
import classNames from 'classnames';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { CW20Addr } from 'shared/types';
import { ListData } from './ListData';
import { ListItem } from './ListItem';
import styles from './TokenList.module.sass';
import { pluralize } from 'shared/utils';
import { useCW20TokenQuery } from 'queries/useCW20TokenQuery';
import { Container } from 'shared/components';
import { useSelectedTokens } from './useSelectedTokens';

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

type TokenListInput = {
  tokens: Token[];
};

const TokenListDialog = (props: DialogProps<TokenListInput, Token[]>) => {
  const { closeDialog, tokens: inputTokens } = props;

  const [searchText, setSearchText] = useState('');

  const { selectedTokens, saveSelectedToken, removeSelectedToken } = useSelectedTokens(inputTokens);

  const { data: cw20Token, isLoading: cw20TokenLoading } = useCW20TokenQuery(searchText as CW20Addr);

  const { tokens, isLoading } = useTokens();

  const onSearchTextChanged = useCallback(
    (text: string) => {
      setSearchText(text);
    },
    [setSearchText]
  );

  const tokenList = useMemo(() => {
    const list = uniqBy([...Object.values(tokens ?? {}), ...inputTokens, ...selectedTokens], (t) => t.key)
      .filter((t) => t.symbol !== undefined && isMatchingToken(t, searchText))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    return list;
  }, [tokens, searchText, inputTokens, selectedTokens]);

  const submitDisabled = useMemo(() => {
    return isEqual(
      sortBy(inputTokens, (t) => t.key).map((t) => t.key),
      sortBy(selectedTokens, (t) => t.key).map((t) => t.key)
    );
  }, [inputTokens, selectedTokens]);

  const listData = useMemo<ListData>(() => {
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
        onSelectToken: saveSelectedToken,
        onDeselectToken: removeSelectedToken,
        isTokenSelected: (token: Token) => Boolean(selectedTokens.find((t) => t.key === token.key)),
      };
    }

    return {
      tokens: tokenList,
      onSelectToken: saveSelectedToken,
      onDeselectToken: removeSelectedToken,
      isTokenSelected: (token: Token) => Boolean(selectedTokens.find((t) => t.key === token.key)),
    };
  }, [tokenList, cw20Token, saveSelectedToken, removeSelectedToken, selectedTokens]);

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
      <DialogFooter>
        <Button
          variant="primary"
          disabled={submitDisabled}
          onClick={() => {
            closeDialog(selectedTokens);
          }}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={() => closeDialog(undefined)}>
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useTokenListDialog = () => {
  return useDialog(TokenListDialog);
};
