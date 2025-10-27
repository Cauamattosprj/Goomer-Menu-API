import express from "express";
import logger from "../shared/middleware/loggerMiddleware";
import { productRouter } from "../adapters/rest/ProductController";
import 'dotenv/config';
import { menuRouter } from "@/adapters/rest/MenuController";


const app = express();
const port: number = 3000;

app.use(logger);
app.use(express.json());

app.use("/api", productRouter);
app.use("/api", menuRouter);

app.listen(port, () => {
  console.log(`Groomer Menu API listening on port ${port}`);
});
