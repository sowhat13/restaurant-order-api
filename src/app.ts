import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { default as passportFunc } from './modules/passport';
import './database-connection';
import * as middlewares from './middlewares/index';

import {api} from './api/index';
import {auth} from './api/auth';

const app = express();
app.use(middlewares.responseMiddleware);
app.use(morgan('dev'));
import('helmet').then((helmet) => {
  app.use(helmet.default({
    crossOriginResourcePolicy: false,
  }));
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
passportFunc(passport);

app.get('/', (req: any, res: any) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api', api);
app.use('/auth', auth);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', function (error) {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', function (reason, p) {
  console.error('Unhandled Promise Rejection:', reason);
  // You might want to add additional handling here if needed
});


export default app;
