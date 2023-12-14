import express from 'express';
import restaurant from './restaurant';
const router = express.Router();

router.get('/', (req: any, res: any) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/restaurant', restaurant);

export { router as api }
