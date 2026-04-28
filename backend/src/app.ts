import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { sequelize } from './config/database';
import { errorHandler } from './middleware/error-handler';
import authRoutes from './routes/auth';
import skillRoutes from './routes/skills';
import categoryRoutes from './routes/categories';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';

// Import models to register associations
import './models';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: env.nodeEnv === 'development' });
    console.log('Database synced.');

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
