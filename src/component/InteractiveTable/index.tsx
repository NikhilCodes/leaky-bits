import './style.css';
import { Button, Dropdown, Menu, Space, Table } from 'antd';
import columnGen from '../../helper/column-gen';
import {
  RightOutlined,
  LeftOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
  DownOutlined
} from '@ant-design/icons';
import React, { useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';

export interface dataSourceData {
  [key: string]: any;
}

export class TabledataSource {
  data: readonly dataSourceData[];
  primaryKey: string;
  total?: number;
  columnNames: readonly string[];

  constructor() {
    this.data = [];
    this.primaryKey = null;
    this.total = 0;
    this.columnNames = [];
  }
}

export interface InteractiveTableProps {
  dataSource: TabledataSource;
  loading?: boolean;
  onPaginate: (props: OnPaginateParams) => void;
  exportDataGetter: () => Promise<any>;
}

export interface OnPaginateParams {
  page: number;
  pageSize: number;
  sorter?: {
    columnKey: string;
    order: 'ascend' | 'descend';
  };
}

export function InteractiveTable(props: InteractiveTableProps) {
  // Configs
  const paginationConfig = {
    defaultPageSize: 10,
    options: [5, 10, 50, 100, 500, 1000, -1],
  };

  const paginationMenu = <Menu
    onClick={(e) => {
      setPageSize(+e.key);
      setPage(0);
    }}
    items={[
      ...paginationConfig.options.map((size) => {
        if (size === -1) {
          return { key: Number.MAX_SAFE_INTEGER, label: 'All' };
        }
        return { key: size, label: size };
      }),
    ]}
  />
  //

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(paginationConfig.defaultPageSize);
  const [loadingExportData, setLoadingExportData] = React.useState(false);
  const { onPaginate, dataSource, exportDataGetter, loading } = props;
  useEffect(() => {
    // TODO: Try debounce for throtting
    onPaginate({ page, pageSize });
  }, [page, pageSize]);

  useEffect(() => {
    setPage(0);
  }, [props.dataSource.total]);

  const getPaginationRangeFromPageAndPageSize = () => {
    const start = page * pageSize;
    const end = start + pageSize;
    if (dataSource.total === 0) {
      return '0-0';
    }
    return `${start + 1}-${Math.min(end, dataSource.total)}`;
  };

  const onPrevPage = () => {
    setPage((p) => p ? p - 1 : p);
  };

  const onNextPage = () => {
    if (dataSource.total > pageSize * (page + 1)) {
      setPage((p) => p + 1);
    }
  }

  const exportJsonToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet");
    XLSX.writeFile(workbook, "export.xlsx");
  };

  const exportJsonToCsv = (data, columnNames) => {
    let csv = columnNames.join(',') + '\n';
    csv += data.map((row) => {
      return Object.keys(row).map((key) => {
        return row[key];
      }).join(',');
    }).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const onExport = async (exportType) => {
    try {
      setLoadingExportData(true);
      const { data } = await exportDataGetter();
      switch (exportType.key) {
        case 'xlsx':
          exportJsonToExcel(data);
          break;
        case 'csv':
          exportJsonToCsv(data, dataSource.columnNames);
          break;
        default:
          break;
      }
    } finally {
      setLoadingExportData(false);
    }
  }

  const exportButtonMenu = <Menu
    onClick={onExport}
    items={[
      {
        key: 'csv',
        label: 'CSV',
      },
      {
        key: 'xlsx',
        label: 'XLSX',
      },
    ]}
  />

  const getColumns = useCallback(() => {
    return columnGen(dataSource.columnNames);
  }, [dataSource.columnNames]);

  return <div className={'interactive-table'}>
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

      &nbsp;&nbsp;of {dataSource.total} &nbsp;&nbsp;
      <Button type={'text'} className={'p-0'} onClick={onNextPage}><RightOutlined/></Button>
      <Button type={'text'}
              onClick={() => setPage(Math.ceil(dataSource.total / pageSize) - 1)}><VerticalLeftOutlined/></Button>

      <div className={'buttons-container'}>
        {/* Dropdown button to choose excel or csv */}
        <Dropdown overlay={exportButtonMenu} trigger={['click']}>
          <Button loading={loadingExportData}>
            <Space>
              Export as
              <DownOutlined/>
            </Space>
          </Button>
        </Dropdown>
      </div>
    </div>

    {/* Table */}
    <Table
      pagination={false}
      loading={loading}
      scroll={{ x: 200 * getColumns().length }}
      columns={getColumns()}
      dataSource={dataSource.data}
      showSorterTooltip={false}
      sortDirections={['ascend', 'descend']}
      onChange={(_, filters, sorter, __) => {
        onPaginate({ page, pageSize, sorter: { columnKey: sorter['columnKey'], order: sorter['order'] } })
      }}
      rowKey={(record) => record[dataSource.primaryKey]}
    />
  </div>;
}