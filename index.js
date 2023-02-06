const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// const melderRoutes = require("./routes/inventory");

// app.use("/", (req, res, next) => {
//   next();
// });

// app.use("/warehouse", warehouseRoutes);



app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);
});