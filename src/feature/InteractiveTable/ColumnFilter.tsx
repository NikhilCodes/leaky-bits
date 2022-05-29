import React, { useEffect } from 'react';
import { Button, Col, Input, Modal, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

export enum AndOr {
  AND = 'AND',
  OR = 'OR',
}

export interface ColumnFilter {
  columnKey: string;
  operator: string;
  value: string;
  andOr?: AndOr;
}

export interface ColumnFilterEvent {
  filters: ColumnFilter[];
}

export interface ColumnFilterProps {
  columnKeys: readonly string[];
  onFilter: (e: ColumnFilterEvent) => void;
  initialFilters?: ColumnFilter[];
}

export const ColumnFilter = React.memo(function ColumnFilter(props: ColumnFilterProps) {
  const SUPPORTED_OPERATORS = ['=', '>', '<', '>=', '<=', '<>', 'IN', 'NOT IN', 'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL'];
  const { columnKeys, onFilter } = props;
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [filters, setFilters] = React.useState<ColumnFilter[]>([]);
  const onAddFilter = () => {
    setFilters([...filters, { columnKey: '', operator: '', value: '' }]);
  }

  const showFilter = () => {
    setFilterVisible(true);
  };

  const closeFilter = (e?) => {
    e?.stopPropagation();
    setFilterVisible(false);
  }

  return (
    <>
      <Button onClick={showFilter}>
        Filter <SearchOutlined/>
      </Button>
      <Modal
        width={800}
        visible={filterVisible}
        onCancel={closeFilter}
        onOk={(e) => {
          closeFilter(e);
          onFilter({ filters });
        }}
        title={'Filter'}>
        <Col>
          {filters.map((filter, i) => {
            return (
              <Row key={i} style={{ paddingBottom: 5 }} gutter={4}>
                <Col span={8}>
                  <Select
                    style={{ width: '100%' }}
                    value={filter.columnKey}
                    onChange={(v) => {
                      filters[i].columnKey = v;
                      const newFilters = [...filters];
                      setFilters(newFilters);
                    }}
                  >
                    {columnKeys.map((columnKey) => <Select.Option key={columnKey}>{columnKey}</Select.Option>)}
                  </Select>
                </Col>
                <Col span={4}>
                  <Select
                    style={{ width: '100%' }}
                    value={filter.operator}
                    onChange={(v) => {
                      filters[i].operator = v;
                      const newFilters = [...filters];
                      setFilters(newFilters);
                    }}
                  >
                    {SUPPORTED_OPERATORS.map((op) => <Select.Option key={op}>{op}</Select.Option>)}
                  </Select>
                </Col>
                <Col flex={1}>
                  <Input
                    value={filter.value}
                    onChange={(e) => {
                      filters[i].value = e.target.value;
                      const newFilters = [...filters];
                      setFilters(newFilters);
                    }}
                  />
                </Col>
                {(i !== filters.length - 1) && <Col span={4}>
                  <Select
                    style={{ width: '100%' }}
                    value={filter.andOr}
                    onChange={(v) => {
                      filters[i].andOr = AndOr[v];
                      const newFilters = [...filters];
                      setFilters(newFilters);
                    }}
                  >
                    {['OR', 'AND'].map((v) => <Select.Option key={v}>{v}</Select.Option>)}
                  </Select>
                </Col>}
                <Col span={2}>
                  <Button
                    danger
                    icon={<MinusOutlined/>}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newFilters = [...filters];
                      newFilters.splice(i, 1);
                      setFilters(newFilters);
                    }}/>
                </Col>
              </Row>
            );
          })}
          <Button onClick={onAddFilter}>Add <PlusOutlined/></Button>
        </Col>
      </Modal>
    </>

  );
})