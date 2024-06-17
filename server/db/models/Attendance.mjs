import mongoose from "mongoose";

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  date: Date,
  status: {
    type: String,
    enum: ["Present", "Absent", "Medical Leave", "Half Day", "Casual Leave"],
  },
  daySalary: Number,
  perDaySalary: Number,
  deducted: Number,
  entryExitTime: [Date],
});

const Attendance = mongoose.model("attendance", attendanceSchema);
export default Attendance;
