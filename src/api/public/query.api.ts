import { get } from './utils';
import { TabledataSource } from '../../component/InteractiveTable';

export const getResponseForQuery = async (params: { query: string, page: number, pageSize: number, sorter? }): Promise<TabledataSource> => {
  const filename = params.query.split(' ').pop().toLowerCase();
  const csvFileUrl = `https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/${filename}.csv`;
  const { data: csvData } = await get(csvFileUrl);

  // Converting CSV to JSON
  const csvDataAsJson = csvData.trim().split('\n').map(row => row.split(','));
  const csvHeaders = csvDataAsJson.shift();
  let data: any[] = csvDataAsJson.map(row => {
    const rowAsJson = {};
    row.forEach((value, index) => {
      rowAsJson[csvHeaders[index]] = value;
    });
    return rowAsJson;
  });

  if (params.sorter && params.sorter.order) {
    const { columnKey, order } = params.sorter;
    data = data.sort((a, b) => {
      if (order === 'ascend') {
        return a[columnKey] > b[columnKey] ? 1 : -1;
      }
      return a[columnKey] < b[columnKey] ? 1 : -1;
    });
  }
  return {
    total: data.length,
    columnNames: csvHeaders,
    data: data.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize),
    primaryKey: `${filename.slice(0, filename.length - 1)}ID`
  };
}