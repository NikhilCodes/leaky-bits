import React from 'react';
import './App.css';
import { ReflexContainer, ReflexSplitter, ReflexElement, ReflexHandle } from 'react-reflex';
import Editor from './component/Editor';
import DataViewer from './component/DataViewer';

function App() {
  return (
    <div className="App">
      <ReflexContainer>
        <ReflexElement resizeHeight size={200}>
          <Editor />
        </ReflexElement>

        <ReflexSplitter propagate />

        <ReflexElement minSize={50} resizeHeight>
          <ReflexHandle>
            <div
              style={{
                width: 100,
                height: 5,
                backgroundColor: 'grey',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            />
          </ReflexHandle>
          <DataViewer />
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default App;
