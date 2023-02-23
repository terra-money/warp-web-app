import { Container, UIElementProps } from '@terra-money/apps/components';
import { ReactNode, useEffect, useState } from 'react';
import { Text, Button } from 'components/primitives';
import { ColumnProps } from 'react-virtualized';
import classNames from 'classnames';
import { Footer, FooterDisplay } from './footer/Footer';
import { Table } from './table/Table';
import { ReactComponent as ArrowsIcon } from 'components/assets/Arrows.svg';
import styles from './TableWidget.module.sass';

export type TableFilterProps<T extends string> = {
  filters: T[];
  selectedFilter: T;
  setFilter: (filter: T) => void;
};

type PaginationProps = {
  paginated: boolean;
  page: number;
  setPage: (pg: number) => void;
  hasNextPage?: boolean;
};

type TableWidgetProps<T> = UIElementProps & {
  data: T[];
  isLoading: boolean;
  columns: ColumnProps[];
  title?: JSX.Element | string;
  topBar?: JSX.Element;
  noSearchResultsView?: JSX.Element;
  showNoResults?: boolean;
  emptyView: JSX.Element;
  rowHeight?: number;
  virtualized?: boolean;
  footer?: ReactNode;
} & PaginationProps;

export function TableWidget<T>(props: TableWidgetProps<T>) {
  const {
    data,
    isLoading,
    title,
    topBar,
    noSearchResultsView,
    emptyView,
    columns,
    showNoResults,
    rowHeight,
    virtualized = true,
    paginated = false,
    page,
    setPage,
    hasNextPage,
  } = props;
  const { className } = props;

  const [footerDisplay, setFooterDisplay] = useState<FooterDisplay>();

  useEffect(() => {
    if (isLoading) {
      setFooterDisplay(undefined);
    }
  }, [isLoading]);

  const onNextClick = () => (hasNextPage ? setPage(page + 1) : undefined);
  const onPrevClick = () => setPage(Math.max(page - 1, 1));

  return (
    <Container className={classNames(className, styles.root)} direction="column" component="section">
      {title && (
        <Text className={styles.title} variant="heading1">
          {title}
        </Text>
      )}
      {topBar}
      <div className={styles.divider_header} />
      <Table
        data={data}
        virtualized={virtualized}
        isLoading={isLoading}
        columns={columns}
        showNoResults={showNoResults}
        rowHeight={rowHeight ?? 60}
        noSearchResultsView={noSearchResultsView}
        emptyView={emptyView}
        setFooterDisplay={setFooterDisplay}
      />
      {virtualized === true && paginated === false && (
        <>
          <div className={styles.divider_footer} />
          <Footer display={footerDisplay} />
        </>
      )}

      {paginated === true && (
        <>
          <div className={styles.divider_footer} />
          <Footer className={styles.pagination_footer}>
            {!isLoading && (
              <Container direction="row">
                <Button
                  icon={
                    <ArrowsIcon
                      className={classNames(styles.arrows_left, {
                        [styles.arrows_disabled]: page <= 1,
                      })}
                    />
                  }
                  // disabled={page <= 1}
                  iconGap="none"
                  gutters="none"
                  className={styles.pagination_text_button}
                  onClick={onPrevClick}
                />
                <Text variant={'label'} component={'p'} className={styles.pagination_label}>
                  Page <Text variant={'text'}>{page}</Text>
                </Text>
                <Button
                  icon={<ArrowsIcon />}
                  iconGap="none"
                  gutters="none"
                  className={classNames(styles.pagination_text_button, {
                    [styles.arrows_disabled]: !hasNextPage,
                  })}
                  onClick={onNextClick}
                />
              </Container>
            )}
          </Footer>
        </>
      )}
    </Container>
  );
}
