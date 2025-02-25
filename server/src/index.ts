import cors from "cors";
import bodyParser from "body-parser";
import express, { Application } from "express";
import { RouteHandler } from "./routes";
import ErrorMiddleware from "./middlewares/error.middleware";
import { getEnv } from "./utils/generic/manage-env";
import { limiter } from "./utils/generic/rateLimiter";
const port = getEnv("PORT");
const app: Application = express();

const corsOptions = {
  origin: "http://64.225.84.218:3000",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

RouteHandler(app); //for handling routes.

app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}/`);
});
