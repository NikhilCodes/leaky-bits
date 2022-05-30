import React from 'react';
import './style.css';
import { Select } from 'antd';
import { action } from '../../redux';
import { QueryActions } from '../../redux/types';

export default function Editor() {
  const queryList = [
    'SELECT * FROM Products',
    'SELECT * FROM Orders',
    'SELECT * FROM Customers',
    'SELECT * FROM Suppliers',
    'SELECT * FROM Shippers',
    'SELECT * FROM Regions'
  ];
  return (
    <div className="editor">
      <div style={{position: 'absolute', top: 0}}>
        NOTE: Originally, I wanted it to be a editor, but for purpose of test demo, I just use a select box to select query. Hence the feature to drag the window.
        <br/>
        NOTE: The spinner you see in the table will spin for exactly one second, since I&apos;m simulating how api would behave if it were fetched from actual server.
        It is not a unintentional delay.
      </div>
      <Select
        className="query-select"
        onSelect={(v) => {
          action(QueryActions.EXECUTE_QUERY, { pageSize: 10, page: 0, query: v });
        }}
      >
        {queryList.map((q) => (
          <Select.Option key={q} value={q}>
            {q}
          </Select.Option>
        ))}
      </Select>
      <div style={{position: 'absolute', bottom: 0}}>
        NOTE: You can drag adjust the split size by dragging the handle below
      </div>
    </div>
  );
}
