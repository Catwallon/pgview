import { apiFetch } from "./client";

export const fetchGetDatabases = () => apiFetch("/databases");

export const fetchGetTables = (dbName: string) =>
  apiFetch(`/databases/${dbName}/tables`);

export const fetchGetColumns = (dbName: string, tableName: string) =>
  apiFetch(`/databases/${dbName}/tables/${tableName}/columns`);

export const fetchGetRows = (
  dbName: string,
  tableName: string,
  limit: number,
  page: number,
) =>
  apiFetch(
    `/databases/${dbName}/tables/${tableName}/rows?limit=${limit}&page=${page}`,
  );

export const fetchEditRow = (
  dbName: string,
  tableName: string,
  rowId: string,
  updateData: Record<string, string>,
) =>
  apiFetch(`/databases/${dbName}/tables/${tableName}/rows/${rowId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
