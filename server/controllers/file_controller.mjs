import multer from "multer";
import csvToJson from "csvtojson";
import mongoose from "mongoose";

// Define a Mongoose schema for the employees
const employeeSchema = new mongoose.Schema({
  employeeId: String,
  firstName: String,
  department: String,
  date: String,
  times: String,
  time: String,
});

// Create a model from the schema
const EmployeeTimeSheet = mongoose.model("EmployeeSheets", employeeSchema);

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("csvfile");

export const uploadFile = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle errors related to multer operation
      return res.status(500).json(err);
    } else if (err) {
      // Handle other potential errors
      return res.status(500).json(err);
    }

    // Convert CSV buffer to JSON
    csvToJson({
      noheader: true,
      output: "json",
      headers: [
        "Employee ID",
        "First Name",
        "Department",
        "Date",
        "Times",
        "Time",
      ],
    })
      .fromString(req.file.buffer.toString())
      .then(async (jsonObj) => {
        // Skip the first row if it's incorrectly formatted due to missing headers in CSV
        const validData = jsonObj.slice(1);
        console.log(validData, "validData");

        const processedTimeSheets = validData.map((sheet) => ({
          employeeId: sheet["Employee ID"],
          firstName: sheet["First Name"],
          department: sheet.Department,
          date: sheet.Date,
          times: sheet.Times,
          time: sheet.Time,
        }));

        console.log(processedTimeSheets); // Log the processed data to check its structure

        const insertedTimeSheets = await EmployeeTimeSheet.insertMany(
          processedTimeSheets
        );
        const data = insertedTimeSheets.slice(1);
        res.status(200).json(data);
        // Insert the data into MongoDB
        // Employee.insertMany(validData)
        //   .then(() => {
        //     res
        //       .status(200)
        //       .json({ message: "Data imported successfully", data: validData });
        //   })
        //   .catch((dbError) => {
        //     res.status(500).json({
        //       message: "Failed to insert data into MongoDB",
        //       error: dbError.message,
        //     });
        //   });
        // res.status(200).json({
        //   message: "Data imported successfully",
        //   data: insertedTimeSheets,
        // });
      })
      .catch((error) => {
        // Handle errors during CSV to JSON conversion
        res.status(500).send("Failed to convert CSV to JSON: " + error.message);
      });
  });
};

export const getEmployeeData = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await EmployeeTimeSheet.find({
      employeeId: employeeId,
    });
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.status(200).json({employee});
  } catch (error) {
    res.status(500).send("Failed to get employee: " + error.message);
  }
};
