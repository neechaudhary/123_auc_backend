const express = require("express");
const router = express.Router();
require("dotenv").config();
var fs = require("fs");
const path = require("path");
require("dotenv").config();

//Upload File
router.post("/", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: "error",
        message: "Error: No file uploaded",
      });
    } else {
      // Send File on Location
      const uploadedFile = req.files.uploadedFile;
      uploadedFile.mv("./files/" + uploadedFile.name);
      res.send({
        status: "success",
        message: "File successfully uploaded",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "error.message" });
  }
});

//Get File directly
router.get("/dir", (req, res) => {
  res.json({ files_Path: process.env.BASE_URL + "/files" });
});

//Static file
router.use("/", express.static("files"));

//Get All files
router.get("/uploaded_files", (req, res) => {
  try {
    const directoryPath = path.join(__dirname, "../files");

    fs.readdir(directoryPath, function (err, files) {
      res.send(
        files.map((file) => {
          return {
            id: Buffer.from(file).toString("base64"),
            name: file,
            path: process.env.BASE_URL + "/files/" + file,
            size: fs.statSync(path.join(directoryPath, file)).size,
            file_extension: path.extname(file),
            date: fs.statSync(path.join(directoryPath, file)).mtime,
          };
        })
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Delete files
router.post("/delete", (req, res) => {
  try {
    const name = req.body.name;
    const directoryPath = path.join(__dirname, "../files");
    fs.unlink(`${directoryPath}/${name}`, (error) => {
      if (error) {
        res.status(500).json({ message: error.message, status: "error" });
      }
    });
    res.send({
      status: "success",
      message: "File successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = router;