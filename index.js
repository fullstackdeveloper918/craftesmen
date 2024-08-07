const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./routes/router");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 100000,
  })
);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
global.imagePath = path.join(__dirname, "public", "logo.png");

// Use CORS middleware with specified options

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
