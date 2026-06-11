const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const notFoundMiddleware = require("./middleware/not-found.middleware");
const errorHandlerMiddleware = require("./middleware/error-handler.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
