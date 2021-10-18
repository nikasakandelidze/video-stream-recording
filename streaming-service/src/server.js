const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50MB", type: "application/json" }));

app.post("/api/upload", (req, res) => {
  try {
    const { data } = req.body;
    const dataBuffer = Buffer.from(data, "base64");
    const fileStream = fs.createWriteStream("./uploads/video.webm", {
      flags: "a",
    });
    fileStream.write(dataBuffer);
    return res.json({ gotit: true });
  } catch (error) {
    console.log(error);
    return res.json({ gotit: false });
  }
});

app.listen(8081, () => console.log("Example app listening on port 8081!"));
