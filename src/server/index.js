const express = require("express");
const app = express();
const V1Routes = require("./routers/index");
const port = 4000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/v1.0", V1Routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
