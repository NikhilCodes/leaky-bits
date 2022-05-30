import { get } from './utils';
import { TabledataSource } from '../../feature/InteractiveTable';

/**
 * Get mock data for query
 * @param {{query: string, page?: number, pageSize?: number, sorter?}} params
 * @returns {Promise<TabledataSource>}
 */
export const getResponseForQuery = async (params: {
  query: string;
  page?: number;
  pageSize?: number;
  sorter?;
}): Promise<TabledataSource> => {
  // NOTE: This is a mock implementation. In a real application, you would use the API to get the data.
  // The delay is to simulate the time it takes to get the data from the server.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filename = params.query.split(' ').pop().toLowerCase();
  const csvFileUrl = `https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/${filename}.csv`;
  const { data: csvData } = await get(csvFileUrl);

  // Converting CSV to JSON
  const csvDataAsJson = csvData
    .trim()
    .split('\n')
    .map((row) => row.split(','));
  const csvHeaders = csvDataAsJson.shift();
  let data = csvDataAsJson.map((row) => {
    const rowAsJson = {};
    row.forEach((value, index) => {
      rowAsJson[csvHeaders[index]] = value;
    });
    return rowAsJson;
  });

  // Sorting data
  if (params.sorter && params.sorter.order) {
    const { columnKey, order } = params.sorter;
    data = data.sort((a, b) => {
      let v1 = a[columnKey];
      let v2 = b[columnKey];
      if (!isNaN(v1 - v2)) {
        v1 = +v1;
        v2 = +v2;
      }
      if (order === 'ascend') {
        return v1 > v2 ? 1 : -1;
      }
      return v1 < v2 ? 1 : -1;
    });
  }

  const total = data.length;
  // Pagination
  if (params.page != null && params.pageSize != null) {
    data = data.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize);
  }

  return {
    total,
    columnNames: csvHeaders,
    data,
    primaryKey: `${filename.slice(0, filename.length - 1)}ID`
  };
};

/**
 * Get mock summary for a column inside a table
 * @param {string} _tableName
 * @param {string} _columnKey
 * @returns {Promise<{min: number, avg: number, median: number, max: number, count: number, distinct: number, sum: number, artifacts: {data: ({x: string, y: number} | {x: string, y: number} | {x: string, y: number} | {x: string, y: number} | {x: string, y: number})[], title: string, type: string}[]}>}
 */
export const getColumnSummary = async (_tableName: string, _columnKey: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    max: 30,
    min: 0,
    avg: 12.223,
    median: 15,
    sum: 121,
    count: 28,
    distinct: 5,
    artifacts: [
      {
        title: 'Frequency',
        type: 'histogram',
        data: [
          {
            x: '0',
            y: 7
          },
          {
            x: '5',
            y: 8
          },
          {
            x: '15',
            y: 4
          },
          {
            x: '20',
            y: 3
          },
          {
            x: '30',
            y: 2
          }
        ]
      }
      // ... more such artifacts could go here
    ]
  };
};
