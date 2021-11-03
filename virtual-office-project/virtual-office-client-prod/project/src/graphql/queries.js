/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOfficeMapTable = /* GraphQL */ `
  query GetOfficeMapTable($id: String!) {
    getOfficeMapTable(id: $id) {
      id
      map_data
    }
  }
`;
export const listOfficeMapTables = /* GraphQL */ `
  query ListOfficeMapTables(
    $filter: TableOfficeMapTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOfficeMapTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        map_data
      }
      nextToken
    }
  }
`;
