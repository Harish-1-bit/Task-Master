import dotenv from "dotenv";
import express from "express";
import colors from "colors";
import connectDB from "../config/dbConfig.js";
import errorHandler from "./middleware/errorMiddleWare.js";
import authRoute from "./router/authRoute.js";
import adminRoute from "./router/adminRoute.js";
import managerRoute from "./router/managerRoute.js";
import employeeRoute from "./router/employeeRoute.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Project Management API");
});
connectDB();

// Auth Routes
app.use("/api/auth", authRoute);

// Admin Routes
app.use("/api/admin", adminRoute);

// Manager Routes
app.use("/api/manager", managerRoute);

// Employee Routes
app.use("/api/employee", employeeRoute);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`.bgBlue);
});

export default app;
