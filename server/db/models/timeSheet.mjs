import mongoose from "mongoose";

const employeeTimeSheetSchema = new mongoose.Schema({
  employeeId: Number,
  firstName: String,
  department: String,
  date: Date,
  times: Number,
  time: [String],
});

const EmployeeTimeSheet = mongoose.model(
  "EmployeeTimeSheet",
  employeeTimeSheetSchema
);

export default EmployeeTimeSheet;
