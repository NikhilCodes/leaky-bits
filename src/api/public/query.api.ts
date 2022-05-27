import { get } from './utils';
import { TabledataSource } from '../../component/InteractiveTable';

export const getResponseForQuery = async (params: { query: string, page: number, pageSize: number }): Promise<TabledataSource> => {
  const csvFileUrl = 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/products.csv';
  const { data: csvData } = await get(csvFileUrl);

  // Converting CSV to JSON
  const csvDataAsJson = csvData.split('\n').map(row => row.split(','));
  const csvHeaders = csvDataAsJson.shift();
  const data: any[] = csvDataAsJson.map(row => {
    const rowAsJson = {};
    row.forEach((value, index) => {
      rowAsJson[csvHeaders[index]] = value;
    });
    return rowAsJson;
  });

  return {
    total: data.length,
    data: data.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize),
  };
}