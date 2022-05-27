import './style.css';
import { Button, Dropdown, Menu, Table } from 'antd';
import columnGen from '../../helper/column-gen';
import {
  RightOutlined,
  LeftOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
  DownOutlined
} from '@ant-design/icons';
import React, { useCallback, useEffect } from 'react';

export interface dataSourceData {
  [key: string]: any;
}

export interface TabledataSource {
  data: readonly dataSourceData[];
  primaryKey: string;
  total?: number;
}

export interface InteractiveTableProps {
  dataSource: TabledataSource;
  loading?: boolean;
  onPaginate: (props: OnPaginateProps) => void;
}

export interface OnPaginateProps {
  page: number;
  pageSize: number;
}

export function InteractiveTable(props: InteractiveTableProps) {
  // Configs
  const paginationConfig = {
    defaultPageSize: 10,
    options: [5, 10, 50, 100, 500, 1000],
  };

  const paginationMenu = <Menu
    onClick={(e) => {
      setPageSize(+e.key);
      setPage(0);
    }}
    items={[
      ...paginationConfig.options.map((size) => ({ key: size, label: size })),
    ]}
  />
  //

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(paginationConfig.defaultPageSize);

  useEffect(() => {
    // TODO: Try debounce for throtting
    props.onPaginate({ page, pageSize });
  }, [page, pageSize]);

  const getPaginationRangeFromPageAndPageSize = () => {
    const start = page * pageSize;
    const end = start + pageSize;
    if (props.dataSource.total === 0) {
      return '0-0';
    }
    return `${start + 1}-${Math.min(end, props.dataSource.total)}`;
  };

  const onPrevPage = () => {
    setPage((p) => p ? p - 1 : p);
  };

  const onNextPage = () => {
    if (props.dataSource.total > pageSize * (page + 1)) {
      setPage((p) => p + 1);
    }
  }

  const getColumns = useCallback(() => {
    return columnGen(props.dataSource.data);
  }, [props.dataSource.data]);

  return <div>
    {/* Table Controls */}
    <div className={'controls'}>
      <Button type={'text'} onClick={() => setPage(0)}><VerticalRightOutlined/></Button>
      <Button type={'text'} className={'p-0'} onClick={onPrevPage}><LeftOutlined/></Button>
      <div style={{ paddingLeft: 10 }}>
        <Dropdown overlay={paginationMenu} trigger={['click']}>
          <Button style={{ minWidth: 100 }}>
            <span>{getPaginationRangeFromPageAndPageSize()}</span>
            <DownOutlined/>
          </Button>
        </Dropdown>
      </div>

      &nbsp;&nbsp;of {props.dataSource.total} &nbsp;&nbsp;
      <Button type={'text'} className={'p-0'} onClick={onNextPage}><RightOutlined/></Button>
      <Button type={'text'}
              onClick={() => setPage(((props.dataSource.total / pageSize) - 1))}><VerticalLeftOutlined/></Button>
    </div>

    {/* Table */}
    <Table
      pagination={false}
      loading={props.loading}
      scroll={{ x: 200 * getColumns().length }}
      columns={getColumns()}
      dataSource={props.dataSource.data}
      rowKey={(record) => record[props.dataSource.primaryKey]}
    />
  </div>;
}