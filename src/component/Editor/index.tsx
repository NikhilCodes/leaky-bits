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
    </div>
  );
}
