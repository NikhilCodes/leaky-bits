import './style.css';
import { Button, Col, Drawer, Skeleton, Table, Typography } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect } from 'react';
import {
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';
import { getColumnSummary } from '../../api/public/query.api';
import { SorterResult } from 'antd/es/table/interface';
import { paginationConfig, TableControls } from './TableControl';

export interface DataSourceData {
  [key: string]: unknown;
}

export class TabledataSource {
  data: readonly DataSourceData[];

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
  exportDataGetter: () => Promise<{ data; columnNames }>;
}

export interface OnPaginateParams {
  page: number;
  pageSize: number;
  sorter?: {
    columnKey: string;
    order: 'ascend' | 'descend';
  };
}

export default function InteractiveTable(props: InteractiveTableProps) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(paginationConfig.defaultPageSize);
  const { onPaginate, dataSource, exportDataGetter, loading } = props;

  useEffect(() => {
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

  const getColumns = useCallback(
    () => tableColumnGen(dataSource.columnNames, getColumnSummary),
    [dataSource.columnNames]
  );

  return (
    <div className="interactive-table">
      {/* Table Controls */}
      <TableControls
        exportDataGetter={exportDataGetter}
        total={dataSource.total}
        page={page}
        columnKeys={dataSource.columnNames}
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
        onChange={(_, filters, sorter: SorterResult<unknown>) => {
          onPaginate({
            page,
            pageSize,
            sorter: { columnKey: sorter.columnKey.toString(), order: sorter.order }
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
  summaryGetter: (tableName: string, columnKey: string) => Promise<ISummaryData>;
}

interface ISummaryData {
  max: number;
  min: number;
  avg: number;
  sum: number;
  count: number;
  distinct: number;
  median: number;
  artifacts: { type: 'histogram' | 'pie'; data: unknown[]; title: string }[];
}

const SummaryDrawer = React.memo(function SummaryDrawer(props: SummaryDrawerProp) {
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
      size="large"
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
                <div key={artifact.title + i}>
                  <Typography.Title level={5}>{artifact.title}</Typography.Title>
                  <XYPlot xType="ordinal" width={460} height={300} stackBy="y">
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <VerticalBarSeries barWidth={0.5} data={artifact.data} />
                  </XYPlot>
                </div>
              ))}
            </Col>
          </div>
        </Skeleton>
      </div>
    </Drawer>
  );
});

function tableColumnGen(columnNames, summaryGetter?) {
  return columnNames.map((header) => ({
    title: (
      <span>
        <ShowMoreButton columnKey={header} summaryGetter={summaryGetter} />
        <span>{header}</span>
      </span>
    ),
    dataIndex: header,
    key: header,
    sorter: () =>
      // Disable sorting on client side.
      // This can't be undefined for sorting buttons to show up.
      0,
    render: (value) => {
      if (value == null || value === 'NULL') {
        return <span style={{ color: 'gray' }}>NULL</span>;
      }
      return <span>{value}</span>;
    }
  }));
}

const ShowMoreButton = React.memo(function ShowMoreButton(props: {
  columnKey: string;
  summaryGetter?;
}) {
  const [summaryDrawerVisible, setSummaryDrawerVisible] = React.useState(false);

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setSummaryDrawerVisible(true);
        }}
        type="text"
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
