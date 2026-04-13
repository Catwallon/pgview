interface Column {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  length?: number;
  precision?: number;
  scale?: number;
  nullable: boolean;
}

export interface TableFullResponse {
  name: string;
  columns: Column[];
}
