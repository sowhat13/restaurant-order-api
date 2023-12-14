import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserProfile from '../models/userProfile';
const router = express.Router();
const secretOrKey = process.env.JWT_SECRET_LOGIN as string


router.post('/signup', passport.authenticate('local-signup', { session: false }), async (req: any, res: any) => {
  // sign up
  try {

    const profile = await new UserProfile({ userId: req.user._id });
    await profile.save()

    // login

    jwt.sign({ user: req.user }, secretOrKey, { expiresIn: '7d' }, async (err: any, token: any) => {
      if (err) {
        return res.json({
          message: 'Failed to login',
          token: null,
        });
      }

      const profiledata = await UserProfile.findOne({ userId: req.user._id }, { _id: 0 }).lean();

      res.json({
        message: 'success',
        data: {
          username: req.user.username,
          ...profiledata,
          token
        },
        code: 200,
        token,
      });
    });
  } catch (err) {
    res.status(401).json({
      message: err,
      isError: true,
      code: 401,
    });
  }
});

router.post('/login', passport.authenticate('local-login', { session: false }), (req: any, res: any) => {

  try {
    jwt.sign({ user: req.user }, secretOrKey, { expiresIn: '7d' }, async (err: any, token: any) => {
      if (err) {
        return res.status(401).json({
          message: 'Failed to login',
          token: null,
        });
      }
      const profile = await UserProfile.findOne({ userId: req.user._id }, { _id: 0 }).lean();
      res.status(200).json({
        message: 'success',
        data: {
          username: req.user.username,
          ...profile,
          token
        },
        code: 200,
        token,
      });
    });
  } catch (err) {
    console.log(err, 'err')

    res.status(401).json({
      message: err,
      isError: true,
      code: 401,
    });
  }
});


export { router as auth }

