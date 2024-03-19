const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require("./config/database");

dotenv.config();
//database
connectDb();
//rest api
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode at port number ${port}`
  );
});
