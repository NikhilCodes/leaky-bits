// Generates column definitions for an ANTD table using the given data.
export default function tableColumnGen(columnNames) {
  return columnNames.map(header => {
    return {
      title: header,
      dataIndex: header,
      key: header,
      sorter: (_, __) => {
        // Disable sorting on client side.
        // This can't be undefined for sorting buttons to show up.
        return 0;
      },
      render: (value) => {
        if (value == null || value == 'NULL') {
          return <span style={{color: 'gray'}}>NULL</span>
        }
        return <span
          // TODO: Selection handlers
        >{value}</span>
      }
    };
  });
}