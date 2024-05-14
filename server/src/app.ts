import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./Config/connectDB";
import router from "./Routes";
import cors from "cors";
import * as path from "path";

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
const DATABASE_URL: string = process.env.DATABASE_URL as string;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use("/get", express.static(path.join(__dirname, "/Uploads")));

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`Can't find ${req.originalUrl} on the server.`);
  err.status = "Fail to load..";
  err.statusCode = 404;
  next(err);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  error.statusCode = error.statusCode || 400;
  error.status = error.status || "Error";
  res.status(error.statusCode).json({
    success: false,
    status: error.statusCode,
    message: error.message,
    data: null
  });
});

app.listen(port, () => {
  connectDB(DATABASE_URL);
  console.log(`Server is running on port number : ${port}`);
});
