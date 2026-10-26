import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "../config/passport.js";
import helmet from "helmet";
import config from "../config/config.js";
import morgan from "morgan";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors({
    origin: config.client_url,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// helmet security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));


// Router
import authRouter from "../routes/auth.routes.js";
import accountRouter from "../routes/account.routes.js";
import transactionRouter from "../routes/transaction.routes.js";


// Routes
/**
 * authentication and authorization related routes
 */
app.use("/api/auth", authRouter);

/**
 * account related routes
 */
app.use("/api/account", accountRouter);

/**
 * transaction related routes
 */
app.use("/api/transaction", transactionRouter);

export default app;
