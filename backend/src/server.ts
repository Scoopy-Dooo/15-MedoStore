import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.ts';
import { generalLimiter } from './middlewares/rateLimiter.ts';
import routes from './routes/index.ts';
import prisma from './config/database.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', generalLimiter);

app.get('/', (req, res) => {
  res.json({ message: 'Medo Store API', version: '2.0.0' });
});

app.use('/api', routes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

startServer();
