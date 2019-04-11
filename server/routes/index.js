import express from 'express';
import userRoutes from './userRoutes';
import accountRoutes from './accountRoutes';

const router = express.Router();

router.use('/auth', userRoutes);
router.use('/accounts', accountRoutes);


router.get('/', (req, res) => {
  res.status(200).json({
    message: 'welcome to banka version 1.0',
  });
});

export default router;
