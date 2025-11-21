// TypeScript interfaces for WPForms API responses

export interface WPFormFieldValue {
  label: string;
  value: string;
  type:
    | "text"
    | "email"
    | "file"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "number"
    | "date";
}

export interface WPFormEntry {
  entry_id: number;
  form_id: number;
  date: string;
  status: "read" | "unread";
  fields: {
    [key: string]: WPFormFieldValue;
  };
}

export interface WPFormsPagination {
  page: number;
  per_page: number;
  total: number;
}

export interface WPFormsEntriesResponse {
  entries: WPFormEntry[];
  pagination: WPFormsPagination;
}

export interface FetchEntriesParams {
  formId: string;
  page?: number;
  perPage?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// src/types/wpforms.ts
export interface Fields {
  [key: number]: string | undefined;
  // common keys we expect:
  1?: string;
  2?: string;
  3?: string;
  4?: string;
  5?: string;
  6?: string;
  7?: string;
  8?: string;
  20?: string; // student name
  21?: string; // student email
}

export interface StudentEntry {
  entry_id: string;
  date: string; // "2025-11-13 04:45:32"
  user_id?: string;
  fields: Fields;
  status?: "submitted" | "read" | "processed";
}
