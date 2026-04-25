import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import express from 'express'
import { getUser, addUser, editUser } from './db/postgres.js';

const router = express.Router();


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  // checks if the user already exists in the database, and adds the user if not
  let user = await getUser(profile.id);
  if (!user) {
    user = await addUser(
      profile.emails?.[0]?.value,
      profile.id,
      profile.displayName,
      null,
      profile.photos?.[0]?.value,
      null,
      false
    );
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.gid));
passport.deserializeUser(async (gid, done) => {
  const user = await getUser(gid);
  done(null, user);
});

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

router.get("/logout", (req, res) => {
  req.logout(() => res.redirect(process.env.CLIENT_URL));
});

export default router;