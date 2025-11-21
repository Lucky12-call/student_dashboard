import fetch from "node-fetch";
import archiver from "archiver";
import path from "path";

// WORDPRESS DOCUMENTS URL
const WP_URL =
  "https://online.jaipuria.ac.in/Lmslogin/wp-json/student/v1/documents";

// GET all students data
const allStudents = async (_, res) => {
  try {
    const response = await fetch(WP_URL);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// UTILITY → download remote file
async function fetchFile(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    return resp.body; // return stream
  } catch {
    return null;
  }
}

// download docs for specific student
const studentDocsDownload = async (req, res) => {
  const studentId = req.params.id;

  const response = await fetch(WP_URL);
  const students = await response.json();

  const student = students.find((s) => s.student.user_id == studentId);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const fields = student.student.fields || {};
  const fileEntries = Object.values(fields).filter((f) => f.url);

  // Create student folder name
  const studentName =
    student.student.fields?.field_20?.value ||
    student.student.email ||
    student.student.roll_number ||
    `student-${studentId}`;

  const folderName = studentName.replace(/\s+/g, "_");

  const zip = archiver("zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${folderName}.zip"`
  );

  zip.pipe(res);

  for (const file of fileEntries) {
    const stream = await fetchFile(file.url);
    if (stream) {
      const fileName = file.doc_name || path.basename(file.url);

      // FIX: put file inside folder
      zip.append(stream, { name: `${folderName}/${fileName}` });
    }
  }

  zip.finalize();
};

// download all students docs
const allStudentsDocs = async (_, res) => {
  const response = await fetch(WP_URL);
  const students = await response.json();

  const zip = archiver("zip", { zlib: { level: 9 } });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="allStudentsDocs.zip"`
  );

  zip.pipe(res);

  for (const item of students) {
    const student = item.student;
    const fields = student.fields || {};

    // Get student name or fallback
    const studentName =
      student.fields?.field_20?.value ||
      student.email?.split("@")[0] ||
      student.roll_number ||
      "Unknown_Student";

    const folderName = studentName.replace(/\s+/g, "_");

    const docs = Object.values(fields).filter((f) => f.url);

    for (const file of docs) {
      const stream = await fetchFile(file.url);
      if (stream) {
        const fileName = file.doc_name || path.basename(file.url);

        // FIX: simply prefix path — no folder() function needed
        zip.append(stream, { name: `${folderName}/${fileName}` });
      }
    }
  }

  zip.finalize();
};

export { allStudents, studentDocsDownload, allStudentsDocs };
