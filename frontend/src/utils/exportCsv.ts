// src/utils/exportCsv.ts
export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[]
) {
  if (!rows || rows.length === 0) {
    return;
  }
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((row) =>
      keys
        .map((k) => {
          const cell = row[k] ?? "";
          const cellStr =
            typeof cell === "string" ? cell : JSON.stringify(cell);
          // escape quotes
          return `"${String(cellStr).replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
