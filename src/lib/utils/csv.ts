/**
 * Generate a CSV file in the browser and trigger a download.
 * Each row is an array of cell values; cells are escaped per RFC 4180.
 */
export function downloadCSV(filename: string, rows: string[][]) {
    const escape = (cell: string) => {
        // Escape quotes by doubling them, wrap in quotes if the cell contains
        // a comma, newline, or quote.
        if (/[",\n\r]/.test(cell)) {
            return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
    };

    const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
    // Prepend BOM so Excel opens UTF-8 correctly
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}