import { apiFetch } from "./client";
import type {
  Pagination,
  RowResponse,
  DatabaseResponse,
  ColumnResponse,
  TableResponse,
} from "@pgview/shared-types";

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

export const fetchInsertRow = (
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

export const fetchDeleteRow = (
  dbName: string,
  tableName: string,
  rowId: string,
): Promise<RowResponse> =>
  apiFetch(`/databases/${dbName}/tables/${tableName}/rows/${rowId}`, {
    method: "DELETE",
  });
