import { InteractiveTable, OnPaginateParams } from '../../feature/InteractiveTable';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { action } from '../../redux';
import { QueryActions } from '../../redux/types';
import { getResponseForQuery } from '../../api/public/query.api';

export function DataViewer() {
  const query = useSelector((state: any) => state.queryReducer);
  const onTablePaginate = useCallback(
    (params: OnPaginateParams) => {
      if (query.lastQuery) {
        action(QueryActions.EXECUTE_QUERY, { query: query.lastQuery, ...params });
      }
    },
    [query.lastQuery]
  );

  const getUnPaginatedQueryData = useCallback(() => {
    return getResponseForQuery({ query: query.lastQuery });
  }, [query.lastQuery]);

  return (
    <InteractiveTable
      dataSource={query.dataSource}
      onPaginate={onTablePaginate}
      exportDataGetter={getUnPaginatedQueryData}
      loading={query.loading}
    />
  );
}
