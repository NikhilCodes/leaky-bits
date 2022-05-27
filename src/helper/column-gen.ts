// Generates column definitions for an ANTD table using the given data.
export default function columnGen(data) {
    if (data.length === 0) {
        return [];
    }
    const headers = Object.keys(data[0]);
    return headers.map(header => {
        return {
            title: header,
            dataIndex: header,
            key: header,
        };
    });
}