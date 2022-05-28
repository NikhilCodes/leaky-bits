import React, { useCallback } from 'react';
import './App.css';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';
import Editor from './component/Editor';
import { DataViewer } from './component/DataViewer';

function App() {
  return (
    <div className="App">
      <ReflexContainer>
        <ReflexElement resizeHeight={true} size={200}>
          <Editor/>
        </ReflexElement>

        <ReflexSplitter propagate={true}/>

        <ReflexElement minSize={50} resizeHeight={true}>
          <DataViewer />
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default App;
