import express from "express";
import multer from "multer";
import sizeOf from "image-size";

const app = express();

const img = multer({
  dest: "./img",
});

app

  .set("view engine", "ejs")
  .set("views", "views")
  .get("/", (r) => r.res.render("./index"))
  .post("/size2json", img.single("image"), async (r) => {
    const tempPath = r.file.path;
    sizeOf(tempPath, function (err, dimensions) {
      r.res.send({
        width: dimensions.width,
        height: dimensions.height,
      });
    });
  })
  .all("/login", (r) => r.res.send("andreeva.anna2909"))
  .listen(process.env.PORT || 3000, () => {
    console.log("Server is working");
  });
