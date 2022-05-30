import React from 'react';
import { Button, Dropdown, Menu, Space } from 'antd';
import * as XLSX from 'xlsx';
import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined
} from '@ant-design/icons';
import { ColumnFilter } from './ColumnFilter';

interface TableControlsProps {
  onNextPage: () => void;
  onPrevPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  total: number;
  page: number;
  pageSize: number;
  columnKeys: readonly string[];
  setPageSize: (pageSize: number) => void;
  exportDataGetter: () => Promise<{ data; columnNames }>;
}

export const paginationConfig = {
  defaultPageSize: 10,
  options: [5, 10, 50, 100, 500, 1000, -1]
};

export const TableControls = React.memo(function TableControls(props: TableControlsProps) {
  const {
    onNextPage,
    onPrevPage,
    onFirstPage,
    onLastPage,
    total,
    page,
    pageSize,
    setPageSize,
    columnKeys,
    exportDataGetter
  } = props;

  const [loadingExportData, setLoadingExportData] = React.useState(false);
  const paginationMenu = (
    <Menu
      onClick={(e) => {
        setPageSize(+e.key);
        onFirstPage();
      }}
      items={[
        ...paginationConfig.options.map((size) => {
          if (size === -1) {
            return { key: Number.MAX_SAFE_INTEGER, label: 'All' };
          }
          return { key: size, label: size };
        })
      ]}
    />
  );

  const PaginationRangeText = React.memo(function PaginationRangeText() {
    const start = page * pageSize;
    const end = start + pageSize;
    if (total === 0) {
      return <span>0-0</span>;
    }
    return <span>{`${start + 1}-${Math.min(end, total)}`}</span>;
  });

  const exportJsonToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');
    XLSX.writeFile(workbook, 'export.xlsx');
  };

  const exportJsonToCsv = (data, columnNames) => {
    let csv = `${columnNames.join(',')}\n`;
    csv += data
      .map((row) =>
        Object.keys(row)
          .map((key) => row[key])
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onExport = async (exportType) => {
    try {
      setLoadingExportData(true);
      const { data, columnNames } = await exportDataGetter();
      switch (exportType.key) {
        case 'xlsx':
          exportJsonToExcel(data);
          break;
        case 'csv':
          exportJsonToCsv(data, columnNames);
          break;
        default:
          break;
      }
    } finally {
      setLoadingExportData(false);
    }
  };

  const exportButtonMenu = (
    <Menu
      onClick={onExport}
      items={[
        {
          key: 'csv',
          label: 'CSV'
        },
        {
          key: 'xlsx',
          label: 'XLSX'
        }
      ]}
    />
  );

  return (
    <div className="controls">
      <Button type="text" onClick={onFirstPage}>
        <VerticalRightOutlined />
      </Button>
      <Button type="text" className="p-0" onClick={onPrevPage}>
        <LeftOutlined />
      </Button>
      <div style={{ paddingLeft: 10 }}>
        <Dropdown overlay={paginationMenu} trigger={['click']}>
          <Button style={{ minWidth: 100 }}>
            <PaginationRangeText />
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      &nbsp;&nbsp;of {total} &nbsp;&nbsp;
      <Button type="text" className="p-0" onClick={onNextPage}>
        <RightOutlined />
      </Button>
      <Button type="text" onClick={onLastPage}>
        <VerticalLeftOutlined />
      </Button>
      <ColumnFilter
        columnKeys={columnKeys}
        onFilter={({ filters }) => {
          onFirstPage();
          // TODO: Do actual filtering
          // NOTE: This is a hack to force the table to re-render if you are page !== 0,
          // basically to simulate what happens when you filter.
          console.log(filters);
        }}
      />
      <div className="buttons-container">
        {/* Dropdown button to choose excel or csv */}
        <Dropdown overlay={exportButtonMenu} trigger={['click']}>
          <Button loading={loadingExportData} type={'primary'}>
            <Space>
              Export as
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
});
