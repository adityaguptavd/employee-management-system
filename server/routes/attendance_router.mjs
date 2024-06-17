import { Router } from "express";
import { fetchAttendance } from "../controllers/attendance_controller.mjs";
import { uploadAttendance, switchAttendanceStatus } from "../controllers/attendance_controller.mjs";

const router = Router();

router.post("/uploadAttendance", uploadAttendance);
router.get("/fetchAttendance/:id", fetchAttendance);
router.patch("/switchAttendanceStatus/:id", switchAttendanceStatus);

export default router;