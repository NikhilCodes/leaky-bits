import { useSelector } from 'react-redux';
import React, { Suspense, useCallback } from 'react';
import { action } from '../../redux';
import { QueryActions, RootReducer } from '../../redux/types';
import { getResponseForQuery } from '../../api/public/query.api';
import { OnPaginateParams } from '../../feature/InteractiveTable';
import { Spin } from 'antd';
const InteractiveTable = React.lazy(() => import('../../feature/InteractiveTable'));
export function DataViewer() {
  const query = useSelector((state: RootReducer) => state.queryReducer);
  const onTablePaginate = useCallback(
    (params: OnPaginateParams) => {
      if (query.lastQuery) {
        action(QueryActions.EXECUTE_QUERY, { query: query.lastQuery, ...params });
      }
    },
    [query.lastQuery]
  );

  const getUnPaginatedQueryData = useCallback(
    () => getResponseForQuery({ query: query.lastQuery }),
    [query.lastQuery]
  );

  return (
    <Suspense fallback={<Spin/>}>
      <InteractiveTable
        dataSource={query.dataSource}
        onPaginate={onTablePaginate}
        exportDataGetter={getUnPaginatedQueryData}
        loading={query.loading}
      />
    </Suspense>
  );
}
