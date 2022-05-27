import './style.css';
import { Button, Select, Table } from 'antd';
import columnGen from '../../helper/column-gen';
import { RightOutlined, LeftOutlined, VerticalRightOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import React from 'react';

export interface dataSourceData {
  [key: string]: any;
}

export interface TabledataSource {
  data: readonly dataSourceData[];
  total?: number;
}

export interface InteractiveTableProps {
  dataSource: TabledataSource;
  loading?: boolean;
}

export function InteractiveTable(props: InteractiveTableProps) {
  // Configs
  const paginationConfig = {
    defaultPageSize: 10,
    options: [5, 10, 50, 100, 500, 1000],
  };
  //

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(paginationConfig.defaultPageSize);

  const getPaginationRangeFromPageAndPageSize = (page: number, pageSize: number) => {
    const start = page * pageSize;
    const end = start + pageSize;
    return `${start + 1}-${end}`;
  }

  return <div>
    {/* Table Controls */}
    <div className={'controls'}>
      <Button type={'text'}><VerticalRightOutlined/></Button>
      <Button type={'text'} className={'p-0'}><LeftOutlined/></Button>
      <div style={{paddingLeft: 10}}>
        <span>{getPaginationRangeFromPageAndPageSize(page, pageSize)}</span>
      </div>
      <Select
        style={{width: 30, color: 'transparent'}}
        defaultValue={paginationConfig.defaultPageSize}
        dropdownMatchSelectWidth={80}
        bordered={false}
        value={pageSize}
        onChange={(value: number) => setPageSize(value)}
      >
        {paginationConfig.options.filter(v => v <= props.dataSource.total).map((value) => (
            <Select.Option
              key={value}
              value={value}
              title={getPaginationRangeFromPageAndPageSize(page, value)}
            >{value}</Select.Option>
          )
        )}
        <Select.Option value={props.dataSource.total}>All</Select.Option>
      </Select> of {props.dataSource.total} &nbsp;&nbsp;
      <Button type={'text'} className={'p-0'}><RightOutlined/></Button>
      <Button type={'text'}><VerticalLeftOutlined/></Button>
    </div>

    {/* Table */}
    <Table
      pagination={false}
      loading={props.loading}
      columns={columnGen(props.dataSource.data)}
      dataSource={props.dataSource.data}
      rowKey={(record) => record.productID}
    />
  </div>;
}