import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import routes from "./src/routes.js";
import notFound from "./src/middlewares/not-found.middleware.js";
import errorHandlerMiddleware from "./src/middlewares/error-handler.middleware.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.listen(process.env.PORT, () => {
  console.log(`Server Running at Port ${process.env.PORT}`);
});

routes.forEach((router) => {
  app.use(router.url, router.route);
});

app.use(notFound);
app.use(errorHandlerMiddleware);
