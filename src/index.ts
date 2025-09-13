import express from "express";
import cartsRouter from "./routes/cartRoutes.js";
import { verifyToken } from "./middleware/auth.js";


const app = express();

app.use(express.json());
app.use("/carts", verifyToken, cartsRouter);
