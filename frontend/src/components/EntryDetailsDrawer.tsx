import { Download, Calendar, FileText, FolderDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function EntryDetailsDrawer({
  entry,
  open,
  onClose,
  isDownloadingStudentDocs,
  setIsDownloadingStudentDocs,
}) {
  if (!entry || !open) return null;

  const student = entry?.student || {};
  const fields = student?.fields || {};

  const name = fields?.field_20?.value || "Student";
  const email = fields?.field_21?.value || "N/A";
  const roll = student?.roll_number || "—";
  const batch = student?.batch_info || "—";

  // ⭐ SHOW RAW DATE
  const rawDate = student?.submission_date || "—";

  const fileFields = Object.entries(fields).filter(([_, f]: any) => f?.url);

  const downloadFile = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  //download particular student docs based on their ID
  const downloadStudentDocs = () => {
    setIsDownloadingStudentDocs(true);
    fetch(
      `http://localhost:4000/api/v1/download/student/${entry?.student?.user_id}`
    )
      .then((response) => {
        const header = response.headers.get("Content-Disposition");

        // Extract filename
        let filename = "student-docs.zip";
        if (header) {
          const match = header.match(/filename="(.+)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        return response.blob().then((blob) => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      })
      .finally(() => {
        setIsDownloadingStudentDocs(false); // stop loader
      });
  };

  console.log("entry", entry.student.user_id);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>STUDENT INFORMATION</SheetTitle>
          {/* <SheetDescription></SheetDescription> */}
        </SheetHeader>
        <Separator />

        {/* Student Info */}
        <table className="space-y-4 w-full">
          <tbody>
            {/* name and email  */}
            <tr>
              <td className="py-2">
                <div>
                  <label className="block font-bold text-lg">Name</label>
                  <div>{name}</div>
                </div>
              </td>
              <td className="py-2">
                <div>
                  <label className="block font-bold text-lg">Email</label>
                  <a
                    href={`mailto:${email}`}
                    className="underline text-blue-600"
                  >
                    {email}
                  </a>
                </div>
              </td>
            </tr>

            {/* roll number and batch  */}
            <tr>
              <td className="py-2">
                <div>
                  <label className="block font-bold text-lg">Roll Number</label>
                  <div>{roll}</div>
                </div>
              </td>
              <td className="py-2">
                <div>
                  <label className="block font-bold text-lg">Batch</label>
                  <div>{batch}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 space-y-6">
          {/* Date */}
          <div className="flex justify-between items-center">
            <div className="text-sm flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {rawDate}
            </div>

            {/* Download All */}
            {fileFields.length > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="default"
                  className="flex gap-2"
                  disabled={isDownloadingStudentDocs}
                  onClick={downloadStudentDocs}
                >
                  {isDownloadingStudentDocs ? (
                    <>
                      <span className="border-2 border-gray-400 border-t-transparent rounded-full w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FolderDown className="h-4 w-4" />
                      Download All Documents
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              Uploaded Documents ({fileFields.length})
            </h3>

            {fileFields.map(
              ([key, f]: [
                string,
                { label: string; url: string; doc_name: string; size: string }
              ]) => (
                <div key={key} className="bg-muted/50 p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium mb-1">{f.label}</p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex justify-start gap-2"
                    onClick={() => downloadFile(f.url)}
                  >
                    <Download className="h-4 w-4" /> {f.doc_name}
                  </Button>

                  <p className="text-xs text-muted-foreground mt-1">{f.size}</p>
                </div>
              )
            )}
          </div>

          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  );
}
