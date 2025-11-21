import { Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface Field {
  doc_name: string;
  label: string;
  size: string;
  url: string;
}

interface Student {
  batch_info: string;
  roll_number: string;
  submission_date: string;
  user_id: string;
  fields: Field[];
}

interface EntriesTableProps {
  entries: Student[];
  onViewEntry: (entry: Student) => void;
}

export function EntriesTable({ entries, onViewEntry }: EntriesTableProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-80 flex justify-center items-center">
        <span className="border-4 border-[#3A315E] border-t-transparent rounded-full w-14 h-14 animate-spin" />
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="min-h-80 flex justify-center items-center">
        Entries not found!
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roll no.</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Documents</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((item: any, index: number) => {
            const student = item?.student || {};
            const fields = student?.fields || {};

            const name = fields.field_20?.value || "N/A";
            const email = fields.field_21?.value || "N/A";
            const batch = student.batch_info || "—";
            const rollNo = student.roll_number || "—";

            // Show raw date (your format "DD-MM-YYYY")
            const rawDate = student.submission_date || "—";

            // Count docs (any entry with a url)
            const docs = Object.values(fields).filter(
              (f: Field) => f?.url
            ).length;

            return (
              <TableRow key={`${student.user_id}-${index}`}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{rollNo}</TableCell>
                <TableCell>{batch}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {rawDate}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge>{docs} files</Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewEntry(item)}
                  >
                    <Eye className="h-4 w-4" /> View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default EntriesTable;
