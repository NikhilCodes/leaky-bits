// Generates column definitions for an ANTD table using the given data.
export default function tableColumnGen(columnNames) {
  return columnNames.map(header => {
    return {
      title: header,
      dataIndex: header,
      key: header,
      sorter: (a, b) => {
        // Disable sorting on client side.
        // This can't be undefined for sorting buttons to show up.
        return 0;
      }
    };
  });
}