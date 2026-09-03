const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const brokerRoutes = require("./routes/broker.routes");
const authorizationRoutes = require("./routes/authorization.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Trading platform API is running",
  });
});

app.use("/api/brokers", brokerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/api/authorizations",
  authorizationRoutes
);
app.use("/api/orders", orderRoutes);

module.exports = app;