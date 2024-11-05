import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// "SECURITY PACKAGES"
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true, // enables default CSP
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
  })
);

app.use(ExpressMongoSanitize());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.static("public"));

app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

// import routes
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import likeRouter from "./routes/like.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthCheckRouter from "./routes/healthCheck.routes.js";
import homeRouter from "./routes/home.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/", homeRouter);

//http://localhost:8000/api/v1/user/register

export { app };
