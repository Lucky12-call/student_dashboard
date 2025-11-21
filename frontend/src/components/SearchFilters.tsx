import { Search, Calendar, X, FolderDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

export function SearchFilters({
  search,
  onSearchChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  batch,
  onBatchChange,
  onClearFilters,
}: any) {
  const { isDownloading, setIsDownloading } = useAuth();

  const downloadAllStudentsDocs = () => {
    setIsDownloading(true);

    fetch("http://localhost:4000/api/v1/download/all")
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "allStudentsDocs.zip";
        a.click();
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  return (
    <Card className="p-4 shadow-md">
      <div className="space-y-4">
        {/* FIRST ROW: Search, Total and Download */}
        <div className="flex items-center gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* total entries */}
          <Button
            variant="default"
            className="flex gap-2 items-center"
            onClick={downloadAllStudentsDocs}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <FolderDown className="h-4 w-4" />
                Download All
              </>
            )}
          </Button>
        </div>

        {/* SECOND ROW: Dates, Batch and Clear */}
        <div className="flex gap-4 items-end">
          {/* From date */}
          <div className="flex-1">
            <Label>
              <Calendar className="inline w-4 h-4" /> From
            </Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>

          {/* To date */}
          <div className="flex-1">
            <Label>
              <Calendar className="inline w-4 h-4" /> To
            </Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>

          {/*  NEW BATCH FILTER  */}
          <div className="flex-1">
            <Label>Batch</Label>
            <Select value={batch} onValueChange={onBatchChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2022-24">2022-24</SelectItem>
                <SelectItem value="2023-25">2023-25</SelectItem>
                <SelectItem value="2024-26">2024-26</SelectItem>
                <SelectItem value="2025-27">2025-27</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(search || dateFrom || dateTo || batch) && (
            <Button variant="outline" onClick={onClearFilters}>
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
