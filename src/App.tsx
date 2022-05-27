import React from 'react';
import './App.css';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';
import Editor from './component/Editor';
import { InteractiveTable } from './component/InteractiveTable';
import { useSelector } from 'react-redux';

function App() {
  const query = useSelector((state: any) => state.queryReducer);

  return (
    <div className="App">
      <ReflexContainer>
        <ReflexElement resizeHeight={true} size={200}>
          <Editor/>
        </ReflexElement>

        <ReflexSplitter propagate={true}/>

        <ReflexElement minSize={50} resizeHeight={true}>
          <InteractiveTable dataSource={query.dataSource} loading={query.loading}/>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default App;
