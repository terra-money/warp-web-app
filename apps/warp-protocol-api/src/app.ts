import express from "express";
import cors from "cors";
import { get as healthCheckHandler } from "./v1/health-check/handler";
import { get as analyticsHandler } from "./v1/analytics/handler";
import { get as jobHandler } from "./v1/job/handler";
import { get as jobHistoryHandler } from "./v1/job/history/handler";
import { get as jobsHandler } from "./v1/jobs/handler";
import { HttpError } from "@apps-shared/api/utils";

const httpErrorHandler = (handler) => async (req, res, next) => {
  handler(req, res, next).catch((error: Error) => {
    if (error instanceof HttpError) {
      res.status(error.statusCode).send(error.message);
      return;
    }
    next(error);
  });
};

const router = express.Router();

router.get("/v1/health-check", httpErrorHandler(healthCheckHandler));
router.get("/v1/analytics", httpErrorHandler(analyticsHandler));
router.get("/v1/jobs", httpErrorHandler(jobsHandler));
router.get("/v1/jobs/:id", httpErrorHandler(jobHandler));
router.get("/v1/jobs/:id/history", httpErrorHandler(jobHistoryHandler));

const app = express();

app.use(cors());

app.use("/", router);

export { app };
