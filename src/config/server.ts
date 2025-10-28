import express from "express";
import { productRouter } from "@/adapters/rest/ProductController";
import { categoryRouter } from "@/adapters/rest/CategoryController";
import { promotionRouter } from "@/adapters/rest/PromotionController";
import { menuRouter } from "@/adapters/rest/MenuController";

const port = 3000
const app = express();

app.use(express.json());
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", promotionRouter);
app.use("/api", menuRouter);

export { app };

app.listen(port, () => {
  console.log(`Groomer Menu API listening on port ${port}`);
});
