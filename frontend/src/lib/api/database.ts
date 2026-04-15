import { apiFetch } from "./client";
import type {
  Pagination,
  RowResponse,
  DatabaseResponse,
  TableSummaryResponse,
  TableFullResponse,
} from "@pgview/shared-types";

export const fetchGetDatabases = (): Promise<DatabaseResponse[]> =>
  apiFetch("/databases");

export const fetchGetTables = (
  dbName: string,
): Promise<TableSummaryResponse[]> => apiFetch(`/databases/${dbName}/tables`);

export const fetchGetTable = (
  dbName: string,
  tableName: string,
): Promise<TableFullResponse> =>
  apiFetch(`/databases/${dbName}/tables/${tableName}`);

export const fetchGetRows = (
  dbName: string,
  tableName: string,
  page: number,
  limit: number,
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

export const fetchUpdateRows = (
  dbName: string,
  tableName: string,
  filters: Record<string, string>,
  updateData: Record<string, string>,
): Promise<RowResponse[]> => {
  const params = new URLSearchParams(filters);

  return apiFetch(`/databases/${dbName}/tables/${tableName}/rows?${params}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
};

export const fetchDeleteRows = (
  dbName: string,
  tableName: string,
  filters: Record<string, string>,
): Promise<RowResponse[]> => {
  const params = new URLSearchParams(filters);

  return apiFetch(`/databases/${dbName}/tables/${tableName}/rows?${params}`, {
    method: "DELETE",
  });
};
