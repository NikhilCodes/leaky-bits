import './style.css';
import { Button, Col, Drawer, Dropdown, Menu, Skeleton, Space, Table, Typography } from 'antd';
import {
  RightOutlined,
  LeftOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
  DownOutlined,
  MoreOutlined
} from '@ant-design/icons';
import React, { useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';
import { getColumnSummary } from '../../api/public/query.api';

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

// Configs
const paginationConfig = {
  defaultPageSize: 10,
  options: [5, 10, 50, 100, 500, 1000, -1]
};

//

export function InteractiveTable(props: InteractiveTableProps) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(paginationConfig.defaultPageSize);
  const { onPaginate, dataSource, exportDataGetter, loading } = props;

  useEffect(() => {
    // TODO: Try debounce for throtting
    onPaginate({ page, pageSize });
  }, [page, pageSize, onPaginate]);

  useEffect(() => {
    setPage(0);
  }, [props.dataSource.total]);

  const onPrevPage = useCallback(() => {
    setPage((p) => (p ? p - 1 : p));
  }, []);

  const onNextPage = useCallback(() => {
    if (dataSource.total > pageSize * (page + 1)) {
      setPage((p) => p + 1);
    }
  }, [page, pageSize, dataSource.total]);

  const onFirstPage = useCallback(() => {
    setPage(0);
  }, []);

  const onLastPage = useCallback(() => {
    setPage(Math.ceil(dataSource.total / pageSize) - 1);
  }, [dataSource.total, pageSize]);

  const getColumns = useCallback(() => {
    return tableColumnGen(dataSource.columnNames, getColumnSummary);
  }, [dataSource.columnNames]);

  return (
    <div className={'interactive-table'}>
      {/* Table Controls */}
      <TableControls
        exportDataGetter={exportDataGetter}
        total={dataSource.total}
        page={page}
        pageSize={pageSize}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onFirstPage={onFirstPage}
        onLastPage={onLastPage}
        setPageSize={setPageSize}
      />

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
          onPaginate({
            page,
            pageSize,
            sorter: { columnKey: sorter['columnKey'], order: sorter['order'] }
          });
        }}
        rowKey={(record) => record[dataSource.primaryKey]}
        sticky
      />
    </div>
  );
}

interface SummaryDrawerProp {
  onClose: (e) => void;
  visible: boolean;
  columnKey: string;
  summaryGetter: (tableName: string, columnKey: string) => Promise<any>;
}

interface ISummaryData {
  max: number;
  min: number;
  avg: number;
  sum: number;
  count: number;
  distinct: number;
  median: number;
  artifacts: { type: 'histogram' | 'pie'; data: any[]; title: string }[];
}

const SummaryDrawer = React.memo((props: SummaryDrawerProp) => {
  const { summaryGetter, columnKey, visible, onClose } = props;
  const [summary, setSummary] = React.useState<ISummaryData>();
  const [loading, setLoading] = React.useState(true);
  const { artifacts, ...tabulatedSummary } = summary ?? { artifacts: [] };
  useEffect(() => {
    if (visible) {
      setLoading(true);
      summaryGetter(null, columnKey)
        .then((value) => {
          setSummary(value);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [columnKey, summaryGetter, visible]);

  const getTableDataFromJson = (json: object) => {
    const data = [];
    for (const key in json) {
      data.push({
        key,
        value: json[key]
      });
    }
    return data;
  };

  return (
    <Drawer
      title={`Summary of ${columnKey}`}
      placement="right"
      onClose={onClose}
      visible={visible}
      size={'large'}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Skeleton loading={loading}>
          <div>
            <Col span={16}>
              <Typography.Title level={4}>Aggregate</Typography.Title>
              <Table
                pagination={false}
                showHeader={false}
                dataSource={getTableDataFromJson(tabulatedSummary)}
                columns={[
                  {
                    key: 'key',
                    title: 'Key',
                    dataIndex: 'key'
                  },
                  {
                    key: 'value',
                    title: 'Value',
                    dataIndex: 'value'
                  }
                ]}
              />

              <br />
              <br />

              <Typography.Title level={4}>Artifacts</Typography.Title>
              {artifacts.map((artifact, i) => (
                <>
                  <Typography.Title level={5}>{artifact.title}</Typography.Title>
                  <XYPlot key={i} xType={'ordinal'} width={460} height={300} stackBy="y">
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <VerticalBarSeries barWidth={0.5} data={artifact.data} />
                  </XYPlot>
                </>
              ))}
            </Col>
          </div>
        </Skeleton>
      </div>
    </Drawer>
  );
});

interface TableControlsProps {
  onNextPage: () => void;
  onPrevPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  total: number;
  page: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  exportDataGetter: () => Promise<any>;
}

const TableControls = React.memo((props: TableControlsProps) => {
  const {
    onNextPage,
    onPrevPage,
    onFirstPage,
    onLastPage,
    total,
    page,
    pageSize,
    setPageSize,
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

  const PaginationRangeText = React.memo(() => {
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
    let csv = columnNames.join(',') + '\n';
    csv += data
      .map((row) => {
        return Object.keys(row)
          .map((key) => {
            return row[key];
          })
          .join(',');
      })
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
    <div className={'controls'}>
      <Button type={'text'} onClick={onFirstPage}>
        <VerticalRightOutlined />
      </Button>
      <Button type={'text'} className={'p-0'} onClick={onPrevPage}>
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
      <Button type={'text'} className={'p-0'} onClick={onNextPage}>
        <RightOutlined />
      </Button>
      <Button type={'text'} onClick={onLastPage}>
        <VerticalLeftOutlined />
      </Button>
      <div className={'buttons-container'}>
        {/* Dropdown button to choose excel or csv */}
        <Dropdown overlay={exportButtonMenu} trigger={['click']}>
          <Button loading={loadingExportData}>
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

function tableColumnGen(columnNames, summaryGetter?) {
  return columnNames.map((header) => {
    return {
      title: (
        <span>
          <ShowMoreButton columnKey={header} summaryGetter={summaryGetter} />
          <span>{header}</span>
        </span>
      ),
      dataIndex: header,
      key: header,
      sorter: (_, __) => {
        // Disable sorting on client side.
        // This can't be undefined for sorting buttons to show up.
        return 0;
      },
      render: (value) => {
        if (value == null || value === 'NULL') {
          return <span style={{ color: 'gray' }}>NULL</span>;
        }
        return (
          <span
          // TODO: Selection handlers
          >
            {value}
          </span>
        );
      }
    };
  });
}

const ShowMoreButton = React.memo((props: { columnKey: string; summaryGetter? }) => {
  const [summaryDrawerVisible, setSummaryDrawerVisible] = React.useState(false);

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setSummaryDrawerVisible(true);
        }}
        type={'text'}
        style={{ marginRight: 5 }}
        icon={<MoreOutlined />}
      />
      <SummaryDrawer
        onClose={(e) => {
          e.stopPropagation();
          setSummaryDrawerVisible(false);
        }}
        visible={summaryDrawerVisible}
        columnKey={props.columnKey}
        summaryGetter={props.summaryGetter}
      />
    </>
  );
});
