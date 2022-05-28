import React, { useCallback } from 'react';
import './App.css';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';
import Editor from './component/Editor';
import { InteractiveTable, OnPaginateParams } from './component/InteractiveTable';
import { useSelector } from 'react-redux';
import { action } from './redux';
import { QueryActions } from './redux/types';
import { getResponseForQuery } from './api/public/query.api';

function App() {
  const query = useSelector((state: any) => state.queryReducer);
  const onTablePaginate = (props: OnPaginateParams) => {
    if (query.lastQuery) {
      action(QueryActions.EXECUTE_QUERY, { query: query.lastQuery, ...props });
    }
  };

  const getUnpaginatedQueryData = async () => {
    return getResponseForQuery({ query: query.lastQuery });
  }

  return (
    <div className="App">
      <ReflexContainer>
        <ReflexElement resizeHeight={true} size={200}>
          <Editor/>
        </ReflexElement>

        <ReflexSplitter propagate={true}/>

        <ReflexElement minSize={50} resizeHeight={true}>
          <InteractiveTable
            dataSource={query.dataSource}
            loading={query.loading}
            onPaginate={onTablePaginate}
            exportDataGetter={getUnpaginatedQueryData}
          />
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default App;
