import express from "express";
import path from "path";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";


dotenv.config();

connectDB();

const app = express();

app.use(express.json());


app.use("/api/users", userRoutes);




app.get("/", (req, res) => {
  res.send("API is running....");
});


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running on port ${PORT}`.yellow.bold
  )
);
