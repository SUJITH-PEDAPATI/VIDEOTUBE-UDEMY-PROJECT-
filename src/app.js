import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)
app.use(express.json({ limit: "16kb"}))

// Commom MiddleWare


// Whenever a " "(Space) is given into the url --> %20 is encoded into the URL
app.use(express.urlencoded({ 
    extended: true,
    limit : "16kb"
}));
app.use(cookieParser());

// Import Routes
import healthCheckRouter from "../src/routes/healthcheck.route.controller.js"
import userRouter from "../src/routes/user.routes.js"
import { errorHandler } from "./middlewares/error.middlewares.js";

//routes
app.use("/api/v1/healthcheck", healthCheckRouter); 
app.use("/api/v1/users", userRouter); 

app.use(errorHandler);
app.use(express.static("public"))
export {app};