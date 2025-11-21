import { useEffect, useState, useMemo } from "react";
import { SearchFilters } from "@/components/SearchFilters";
import { EntriesTable } from "@/components/EntriesTable";
import { EntryDetailsDrawer } from "@/components/EntryDetailsDrawer";
import { PaginationControls } from "@/components/PaginationControls";
import { useAuth } from "@/contexts/AuthContext";
import jaipuriaLogo from "@/assets/jaipuria-logo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StudentEntry } from "@/types/wpforms";
import { LogOut } from "lucide-react";

const safeDate = (dateStr?: string): Date | null => {
  if (!dateStr || typeof dateStr !== "string") return null;

  const s = dateStr.trim();

  // DD-MM-YYYY
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(s)) {
    const [dd, mm, yyyy] = s.split("-");
    const iso = `${yyyy}-${mm}-${dd}T00:00:00`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  // YYYY-MM-DD HH:MM:SS
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(s)) {
    const d = new Date(s.replace(" ", "T"));
    return isNaN(d.getTime()) ? null : d;
  }

  // ISO
  if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(s)) {
    const d = new Date(s.includes("T") ? s : `${s}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

export default function Dashboard() {
  const {
    studentsData,
    fetchStudentsData,
    isDownloadingStudentDocs,
    setIsDownloadingStudentDocs,
    setIsAuthenticated,
  } = useAuth();

  const [selected, setSelected] = useState<StudentEntry | null>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [dateFrom, setFrom] = useState("");
  const [dateTo, setTo] = useState("");
  const [batch, setBatch] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPP] = useState(20);

  useEffect(() => {
    fetchStudentsData();
  }, []);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [search, dateFrom, dateTo, batch]);

  // FILTER LOGIC
  const filtered = useMemo(() => {
    if (!Array.isArray(studentsData)) return [];

    return studentsData.filter((item: any) => {
      if (!item || !item.student) return false;

      const student = item.student;
      const fields = student.fields || {};

      // ----- SEARCH -----
      const sName = (fields.field_20?.value || "").toLowerCase();
      const sEmail = (fields.field_21?.value || "").toLowerCase();
      const q = search.toLowerCase();

      const matchSearch = !search || sName.includes(q) || sEmail.includes(q);

      // ----- DATE FILTER -----
      const parsed = safeDate(student.submission_date || "");
      const ms = parsed ? parsed.getTime() : null;

      const fromMS = dateFrom
        ? new Date(dateFrom + "T00:00:00").getTime()
        : null;
      const toMS = dateTo ? new Date(dateTo + "T23:59:59").getTime() : null;

      const matchFrom = !fromMS || (ms !== null && ms >= fromMS);
      const matchTo = !toMS || (ms !== null && ms <= toMS);
      const matchDate = matchFrom && matchTo;

      // ----- BATCH FILTER -----
      const matchBatch = !batch || student.batch_info === batch;

      // FINAL FILTER RESULT
      return matchSearch && matchDate && matchBatch;
    });
  }, [studentsData, search, dateFrom, dateTo, batch]);

  // Pagination
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const navigate = useNavigate();

  //get batch filters filed
  function getUniqueBatchArray() {
    return [
      ...new Set(
        studentsData.map((item) => item?.student?.batch_info).filter(Boolean) // removes null/undefined
      ),
    ];
  }

  const logout = () => {
    fetch(
      "https://student-dashboard-gamma-one.vercel.app/api/v1/admin/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b shadow-sm bg-white sticky top-0 z-20">
        <div className="flex items-center h-20 px-6">
          <img src={jaipuriaLogo} className="h-12" />
          <div className="flex-1" />
          <Button variant="outline" onClick={logout}>
            <LogOut />
            SignOut
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* FILTERS */}
        <SearchFilters
          search={search}
          onSearchChange={setSearch}
          dateFrom={dateFrom}
          onDateFromChange={setFrom}
          dateTo={dateTo}
          onDateToChange={setTo}
          batch={batch}
          onBatchChange={setBatch}
          onClearFilters={() => {
            setSearch("");
            setFrom("");
            setTo("");
            setBatch("");
          }}
          getUniqueBatchArray={getUniqueBatchArray}
        />

        {/* TABLE */}
        <EntriesTable
          entries={paginated}
          onViewEntry={(e) => {
            setSelected(e);
            setOpen(true);
          }}
        />

        {/* PAGINATION */}
        <PaginationControls
          currentPage={page}
          totalPages={pages}
          totalItems={total}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(pp) => {
            setPP(pp);
            setPage(1);
          }}
        />

        {/* DRAWER */}
        <EntryDetailsDrawer
          entry={selected}
          open={open}
          onClose={() => setOpen(false)}
          isDownloadingStudentDocs={isDownloadingStudentDocs}
          setIsDownloadingStudentDocs={setIsDownloadingStudentDocs}
        />
      </main>
    </div>
  );
}
