import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import { InteractiveTable, OnPaginateParams } from '../../feature/InteractiveTable';
import { action } from '../../redux';
import { QueryActions, RootReducer } from '../../redux/types';
import { getResponseForQuery } from '../../api/public/query.api';

export function DataViewer() {
  const query = useSelector((state: RootReducer) => state.queryReducer);
  const onTablePaginate = useCallback(
    (params: OnPaginateParams) => {
      if (query.lastQuery) {
        action(QueryActions.EXECUTE_QUERY, { query: query.lastQuery, ...params });
      }
    },
    [query.lastQuery],
  );

  const getUnPaginatedQueryData = useCallback(() => getResponseForQuery({ query: query.lastQuery }), [query.lastQuery]);

  return (
    <InteractiveTable
      dataSource={query.dataSource}
      onPaginate={onTablePaginate}
      exportDataGetter={getUnPaginatedQueryData}
      loading={query.loading}
    />
  );
}
