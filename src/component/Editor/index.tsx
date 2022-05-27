import './style.css';
import { Select } from 'antd';
import { action } from '../../redux';
import { useEffect } from 'react';
import { QueryActions } from '../../redux/types';

export default function Editor() {
  useEffect(() => {
    action(QueryActions.EXECUTE_QUERY, { pageSize: 10, page: 0, query: 'select * from test' });
  }, []);

  return (
    <div className="editor">
      <Select className={'query-select'}>
        <Select.Option value="SELECT * FROM Products">SELECT * FROM Products</Select.Option>
      </Select>
    </div>
  );
}