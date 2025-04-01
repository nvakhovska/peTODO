// Importing necessary modules
import express from "express"; // Express framework for building web apps
import morgan from "morgan"; // HTTP request logger middleware
import rateLimit from "express-rate-limit"; // To limit repeated requests to public APIs
import helmet from "helmet"; // Helps secure your app by setting various HTTP headers
import mongoSanitize from "express-mongo-sanitize"; // Middleware to prevent NoSQL injection attacks
import xss from "xss-clean"; // Middleware to sanitize user input and prevent cross-site scripting (XSS)
import hpp from "hpp"; // Middleware to prevent HTTP Parameter Pollution (HPP) attacks by filtering query string parameters
import path from "path"; // To handle and transform file paths
import { fileURLToPath } from "url"; // To convert the file URL to path
import AppError from "./utils/appError.js"; // Custom error handling class
import globalErrorHandler from "./controllers/errorController.js"; // Global error handler middleware
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // Load Google OAuth strategy
// eslint-disable-next-line no-redeclare
import rateLimit from "express-rate-limit";

// Importing custom routes for task and user resources
import taskRouter from "./routes/taskRoutes.js"; // Task-related routes
import userRouter from "./routes/userRoutes.js"; // User-related routes
import cors from "cors";

// Get the current file's path and directory path
const __filename = fileURLToPath(import.meta.url); // Current file name in absolute path
const __dirname = path.dirname(__filename); // Current directory path

// Initialize the express app
const app = express();

// Helmet helps secure the app by setting various HTTP headers
app.use(helmet());

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend's URL
    credentials: true, // Allow cookies
  })
);

// Logging middleware: Only enabled in 'development' mode
if (process.env.NODE_ENV === "development") {
  // Morgan is used for logging HTTP requests in development environment
  app.use(morgan("dev"));
}

// Setting up rate limiting middleware to prevent too many requests from the same IP
const limiter = rateLimit({
  max: 100, // Maximum of 100 requests per IP
  windowMs: 60 * 60 * 1000, // Time window: 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
  message: "Too many requests from this IP, please try again in an hour.", // Response message when rate limit is exceeded
});

// Apply the rate limiter for all routes under '/api'
app.use("/api", limiter);

// Middleware to parse incoming JSON requests with a 10kb size limit
app.use(express.json({ limit: "10kb" }));

//Middleware to sanitize data against NoSQL query injection
app.use(mongoSanitize());

//Middleware to sanitize data against XSS
app.use(xss());

//Middleware to prevent parameter pollution
app.use(hpp({ whitelist: ["status", "priority"] }));

// Serve static files (e.g., images, CSS, JS) from the "public" directory
app.use(express.static(`${__dirname}/public`));

// Middleware to add a timestamp for each request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Adds a 'requestTime' property to the request object
  next(); // Pass the control to the next middleware or route handler
});

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// Define API routes for tasks and users
app.use("/api/v1/tasks", taskRouter); // Routes for task operations
app.use("/api/v1/users", userRouter); // Routes for user operations

// Catch-all route for undefined routes (404 - Not Found error)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // Throws an error for any undefined route
});

// Global error handler middleware
app.use(globalErrorHandler);

// Export the express app instance for use in other parts of the application
export default app;
