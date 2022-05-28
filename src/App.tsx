import React from 'react';
import './App.css';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';
import Editor from './component/Editor';
import { InteractiveTable, OnPaginateProps } from './component/InteractiveTable';
import { useSelector } from 'react-redux';
import { action } from './redux';
import { QueryActions } from './redux/types';

function App() {
  const query = useSelector((state: any) => state.queryReducer);
  const onTablePaginate = (props: OnPaginateProps) => {
    action(QueryActions.EXECUTE_QUERY, { query: query.lastQuery, ...props });
  };

  return (
    <div className="App">
      <ReflexContainer>
        <ReflexElement resizeHeight={true} size={200}>
          <Editor/>
        </ReflexElement>

        <ReflexSplitter propagate={true}/>

        <ReflexElement minSize={50} resizeHeight={true}>
          <InteractiveTable dataSource={query.dataSource} loading={query.loading} onPaginate={onTablePaginate}/>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default App;
