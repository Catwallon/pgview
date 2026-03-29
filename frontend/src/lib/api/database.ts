import type { Pagination } from "@/types/pagination.type";
import { apiFetch } from "./client";
import type { RowResponse } from "@/types/row.response";
import type { DatabaseResponse } from "@/types/database.response";
import type { ColumnResponse } from "@/types/columns.response";
import type { TableResponse } from "@/types/table.response";

export const fetchGetDatabases = (): Promise<DatabaseResponse[]> =>
  apiFetch("/databases");

export const fetchGetTables = (dbName: string): Promise<TableResponse[]> =>
  apiFetch(`/databases/${dbName}/tables`);

export const fetchGetColumns = (
  dbName: string,
  tableName: string,
): Promise<ColumnResponse[]> =>
  apiFetch(`/databases/${dbName}/tables/${tableName}/columns`);

export const fetchGetRows = (
  dbName: string,
  tableName: string,
  limit: number,
  page: number,
  query: string,
): Promise<Pagination<RowResponse>> =>
  apiFetch(
    `/databases/${dbName}/tables/${tableName}/rows?limit=${limit}&page=${page}&query=${query}`,
  );

export const fetchCreateRow = (
  dbName: string,
  tableName: string,
  createData: Record<string, string>,
): Promise<RowResponse> =>
  apiFetch(`/databases/${dbName}/tables/${tableName}/rows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createData),
  });

export const fetchEditRow = (
  dbName: string,
  tableName: string,
  rowId: string,
  updateData: Record<string, string>,
): Promise<RowResponse> =>
  apiFetch(`/databases/${dbName}/tables/${tableName}/rows/${rowId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
