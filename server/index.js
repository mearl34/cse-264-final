import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import authRoutes from "./auth.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));