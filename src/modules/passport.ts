import * as passportJwt from 'passport-jwt';
import * as passportLocal from 'passport-local';
import User from '../models/user';


const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const jwtOptions: any = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET_LOGIN
};
const ps = (passport: any) => {
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username: string, password: string, done: any) => {
        try {
          // check if user exists
          const userExists = await User.findOne({ username });
          if (userExists) {
            return done({ message: 'Username already exist' });
          } // Create a new user with the user data provided
          const user = await User.create({ username, password });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username: string, password: string, done: any) => {
        try {
          const user = await User.findOne({ username });
          if (!user) return done(null, false);
          const isMatch = await user.matchPassword(password);
          if (!isMatch) return done(null, false); // if passwords match return user
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
  passport.use(
    new JwtStrategy(
      jwtOptions,
      async (jwtPayload: any, done: any) => {
        try {
          // Extract user
          const { user } = jwtPayload;
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      },
    ),
  );
};
export default ps;
