const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
const fs = require("fs");
var cookieParser = require('cookie-parser')
app.use(cookieParser())


//Allow cors
const cors = require("cors");
//Loop of allowed origins
const allowedOrigins = ["https://mazzad-admin.vercel.app", "http://localhost:3000", "https://admin-for-all.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const fileUpload = require("express-fileupload");
// Enable file upload using express-fileupload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//Config Firebase
const { fire_auth } = require("./config/firebase");
var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(fire_auth),
});

app.get("/", (req, res) => {
  //Read dir and return JSON
  fs.readdir("./files", (err, files) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({
        files: files,
        files: files.map((file) => {
          return {
            name: file,
            url: `http://localhost:4000/files/${file}`,
          };
        }),
      });
    }
  });
});

//Allow accsess assets  
app.use("/files", express.static("files"));


app.use("/api/v1/register", require("./routes/register"));
app.use("/api/v1/login", require("./routes/login"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/bids", require("./routes/bids"));
app.use("/api/v1/storage", require("./routes/storage"));
app.use("/api/v1/profile",require("./routes/profile"))
app.use("/api/v1/categories", require("./routes/categories"));
app.use("/api/v1/invoice",require("./routes/invoice"))
app.use("/api/v1/notifications",require("./routes/notifications"))
app.use("/api/v1/cart", require("./routes/cart"));
app.use("/api/v1/support", require("./routes/support"));
app.use("/api/v1/search_new", require("./routes/search_new"));
app.use("/api/v1/points", require("./routes/point_management"));
app.use("/api/v1/services",require("./routes/services"));
app.use("/api/v1/companies",require("./routes/companies"));
app.use("/api/v1/commission",require("./routes/commission"))
app.use("/api/v1/offers",require("./routes/offers"));
app.use("/api/v1/tags",require("./routes/tags"))
app.use("/api/v1/classification",require("./routes/classification"))
app.use("/api/v1/blog", require("./routes/blog"));
app.use("/api/v1/setting",require("./routes/settings")) 


app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
