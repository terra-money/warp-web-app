import { CSSProperties, useCallback, useEffect, useMemo, useRef } from 'react';
import { Container } from '@terra-money/apps/components';
import { Text, Throbber } from 'components/primitives';
import { AutoSizer, Column, InfiniteLoader, ScrollEventData, Table as VirtualizedTable } from 'react-virtualized';
import { ColumnProps, defaultRowRenderer, TableRowProps } from 'react-virtualized/dist/es/Table';
import { FooterDisplay } from '../footer/Footer';
import styles from './Table.module.sass';
import classNames from 'classnames';

const loadMoreRows = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // props.setItems((items) => [...items, ...generateStreams(props.filter)]);
};

const tableRowRenderer = (tableProps: TableRowProps, maxLength: number) => {
  if (tableProps.index >= maxLength) {
    // last row
    return (
      <div className={styles.infinite_loader_row} key={tableProps.key} style={tableProps.style}>
        <div className={styles.infinite_loader}>
          <Throbber variant="primary" />
          <Text variant="text">Loading more data...</Text>
        </div>
      </div>
    );
  }
  return defaultRowRenderer(tableProps);
};

type TableComponentProps<T> = {
  data: T[];
  columns: ColumnProps[];
  rowHeight: number;
  isLoading: boolean;
  setFooterDisplay: (display: FooterDisplay) => void;
};

function TableComponent<T>(props: TableComponentProps<T>) {
  const { data, isLoading, setFooterDisplay, columns, rowHeight } = props;
  const ref = useRef<VirtualizedTable | null>(null);

  // needed for search (no scroll interaction, can be removed once search is performed on backend)
  useEffect(() => {
    const tableHeight = ref.current?.props.height ?? 0;
    const rowsVisible = Math.floor(tableHeight / rowHeight);

    if (tableHeight === 0) {
      return;
    }

    if (data.length <= rowsVisible) {
      setFooterDisplay(FooterDisplay.NoMoreRows);
    } else {
      setFooterDisplay(FooterDisplay.MoreRowsBelow);
    }
  }, [data.length, setFooterDisplay, rowHeight]);

  const onScroll = useCallback(
    (event: ScrollEventData) => {
      // scrollHeight >= scrollTop + clientHeight
      const currScrollHeight = event.scrollTop + event.clientHeight;
      const remainingHeight = event.scrollHeight - currScrollHeight;
      const tableHeight = ref.current?.props.height ?? 0;

      if (tableHeight === 0) {
        // initial render missing height & width props
        setTimeout(() => onScroll(event), 10);
        return;
      }

      const rowsVisible = Math.floor(tableHeight / rowHeight);

      if (remainingHeight === 0 || data.length <= rowsVisible) {
        setFooterDisplay(FooterDisplay.NoMoreRows);
        return;
      }

      if (data.length > rowsVisible) {
        setFooterDisplay(FooterDisplay.MoreRowsBelow);
        return;
      }
    },
    [setFooterDisplay, data, rowHeight]
  );

  const rowRenderer = useCallback(
    (tableProps: TableRowProps) => {
      return tableRowRenderer(tableProps, data.length);
    },
    [data.length]
  );

  if (isLoading) {
    return <Throbber className={styles.loading} variant="primary" />;
  }

  return (
    // @ts-ignore
    <InfiniteLoader
      isRowLoaded={({ index }) => !!data[index]}
      loadMoreRows={loadMoreRows}
      // rowCount={data.length + 1} // enable when pagination is implemented
      rowCount={data.length}
    >
      {({ onRowsRendered, registerChild }) => (
        // @ts-ignore
        <AutoSizer
          onResize={(props) => {
            ref.current?.recomputeRowHeights();
          }}
        >
          {({ height, width }) => (
            // @ts-ignore
            <VirtualizedTable
              ref={(r) => {
                ref.current = r;
                registerChild(r);
              }}
              gridClassName={styles.grid}
              onScroll={onScroll}
              scrollToRow={1}
              overscanRowCount={5}
              rowRenderer={rowRenderer}
              height={height}
              width={width}
              headerHeight={30}
              disableHeader={false}
              headerClassName={styles.header}
              rowClassName={styles.row}
              onRowsRendered={onRowsRendered}
              rowHeight={rowHeight}
              rowGetter={({ index }) => {
                // enable when pagination is implemented
                // if (index === data.length) {
                //   index = index - 1;
                // }

                return data[index];
              }}
              // rowCount={data.length + 1} // enable when pagination is implemented
              rowCount={data.length}
            >
              {columns.map((col) => (
                /* @ts-ignore */
                <Column key={col.dataKey} {...col} />
              ))}
            </VirtualizedTable>
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
}

const NonVirtualizedTableComponent = <T,>(props: TableComponentProps<T>) => {
  const { data, columns, rowHeight } = props;

  const headerRow = useMemo(() => {
    const cells = columns.map((column, columnIndex) => {
      const { label } = column;
      const style: CSSProperties = {
        position: 'relative',
        flex: `1 1 ${column.width}px`,
        height: '100%',
        display: 'flex',
      };
      return (
        <span key={columnIndex} className={classNames(column.className, column.headerClassName)} style={style}>
          <>{label}</>
        </span>
      );
    });
    const style: CSSProperties = { position: 'relative', display: 'flex', flexDirection: 'row' };
    return (
      <div className={styles.header} style={style}>
        {cells}
      </div>
    );
  }, [columns]);

  const rows = useMemo(() => {
    return data.map((row, rowIndex) => {
      const cells = columns.map((column, columnIndex) => {
        if (column.cellRenderer !== undefined) {
          const cell = column.cellRenderer({
            rowIndex,
            columnIndex,
            dataKey: column.dataKey,
            isScrolling: false,
            rowData: row,
          });

          const style: CSSProperties = {
            position: 'relative',
            flex: `1 1 ${column.width}px`,
            height: '100%',
            display: 'flex',
          };

          return (
            <div key={`${rowIndex}_${columnIndex}`} style={style} role="gridcell">
              {cell}
            </div>
          );
        }
        return null;
      });
      const style: CSSProperties = { position: 'relative', height: rowHeight, display: 'flex', flexDirection: 'row' };
      return (
        <div key={rowIndex} className={styles.row} role="row" style={style}>
          {cells}
        </div>
      );
    });
  }, [data, columns, rowHeight]);

  return (
    <>
      {headerRow}
      {rows}
    </>
  );
};

export type TableProps<T> = {
  data: T[];
  isLoading: boolean;
  setFooterDisplay: (display: FooterDisplay) => void;
  columns: ColumnProps[];
  noSearchResultsView?: JSX.Element;
  showNoResults?: boolean;
  emptyView: JSX.Element;
  rowHeight: number;
  virtualized?: boolean;
};

export function Table<T>(props: TableProps<T>) {
  const {
    data,
    isLoading,
    noSearchResultsView,
    emptyView,
    setFooterDisplay,
    showNoResults,
    columns,
    rowHeight,
    virtualized = true,
  } = props;

  if (showNoResults) {
    return noSearchResultsView!;
  }

  if (data.length === 0 && !isLoading) {
    return emptyView;
  }

  const tableComponentProps: TableComponentProps<T> = {
    data,
    rowHeight,
    columns,
    isLoading,
    setFooterDisplay,
  };

  return (
    <Container className={styles.root} direction="column">
      {virtualized ? (
        <TableComponent<T> {...tableComponentProps} />
      ) : (
        <NonVirtualizedTableComponent<T> {...tableComponentProps} />
      )}
    </Container>
  );
}
