import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// "SECURITY PACKAGES"
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true, // enables default CSP
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-cdn.com"],
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

// routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);

//http://localhost:8000/api/v1/user/register

export { app };
