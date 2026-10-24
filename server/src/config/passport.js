import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";
import userModel from "../models/user.model.js";
import { sendRegistrationEmail } from "../services/email.service.js";

passport.use(
  // google stragtegy
  new GoogleStrategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: config.google_callback_url,
    },
    // verification function
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check if user exists
        let user = await userModel.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0]?.value }],
        });
        if (user) {
          return done(null, user);
        }

        // if user not exists create new user
        user = await userModel.create({
          googleId: profile.id,
          email: profile.emails[0]?.value,
          name: profile.displayName,
          avatar: profile.photos[0]?.value,
          authProvider: "google",
        });

        sendRegistrationEmail({ to: user.email, name: user.name }).catch((err) => {
          console.error("Error sending welcome email to Google user:", err);
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
