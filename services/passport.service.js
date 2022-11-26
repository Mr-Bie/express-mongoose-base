// Dependencies
const GoogleStrategy = require("passport-google-oauth2");

// Models
const User = require("../model/User.model");

// Constraints
const APP_URL = process.env.APP_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: APP_URL + "auth/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          const result = await User.findOne(
            "Email",
            profile.emails[0].value.toString()
          );
          const existingUser = result[0][0];

          // If user exists return the user
          if (existingUser) {
            return done(null, existingUser);
          }
          // If user does not exist create a new user
          console.log("Creating new user...");
          const [newUser] = await User.save({
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          console.log("New user created!", newUser);
          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  /*  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader("authorization"),
        secretOrKey: SECRET,
      },
      async (jwtPayload, done) => {
        try {
          // Extract user
          const user = jwtPayload.user;
          done(null, user);
        } catch (error) {
          throw new Error(error);
        }
      }
    )
  );*/
};
