import express from "express";
import {
  allStudents,
  allStudentsDocs,
  studentDocsDownload,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/students", allStudents);
router.get("/download/all", allStudentsDocs);
router.get("/download/student/:id", studentDocsDownload);

export default router;
