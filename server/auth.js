import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import express from "express";

const router = express.Router();


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// routes
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

router.get("/me", (req, res) => {
  if (req.user) return res.json(req.user);
  res.status(401).json({ message: "Not logged in" });
});

router.get("/logout", (req, res) => {
  req.logout(() => res.redirect(process.env.CLIENT_URL));
});

export default router;