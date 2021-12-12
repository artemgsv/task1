const multer = require("multer");
const fs = require("fs");
const nodersa = require("node-rsa");
const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();
// const __dirname = path.resolve();

app.use(express.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});

var upload = multer({ storage: storage });

app.use("/", serveStatic(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post(
  "/decrypt",
  upload.fields([
    {
      name: "secret",
      maxCount: 1,
    },
    {
      name: "key",
      maxCount: 1,
    },
  ]),
  (req, res, next) => {
    const files = req.files;

    if (!files) {
      const error = new Error("Please choose files");
      error.httpStatusCode = 400;
      return next(error);
    }

    const privateKey = fs.readFileSync("./uploads/key", "utf8");
    const decrypted = new nodersa(privateKey).decrypt(
      fs.readFileSync("./uploads/secret"),
      "utf8"
    );

    res.send(decrypted);
  }
);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
