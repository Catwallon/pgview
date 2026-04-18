interface Column {
  name: string;
  type: string;
  length?: number;
  precision?: number;
  scale?: number;
  isPrimaryKey: boolean;
  isNullable: boolean;
  isArray: boolean;
}

export interface TableFullResponse {
  name: string;
  columns: Column[];
}
