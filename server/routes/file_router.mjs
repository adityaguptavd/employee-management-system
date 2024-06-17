import { Router } from "express";
import {
  uploadFile,
  getEmployeeData,
} from "../controllers/file_controller.mjs";

const router = Router();

// POST /api/files/upload
router.post("/upload", uploadFile);
router.get("/getEmployeeData/:id", getEmployeeData);

export default router;
