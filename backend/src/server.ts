import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { connectDB } from './utils/db';
import widgetsRoutes from './routes/widgets';
import healthRoutes from './routes/health';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify({
  logger: true,
});

async function start() {
  try {
    // Plugins
    await app.register(sensible);
    await app.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    });

    // Routes
    await app.register(healthRoutes, { prefix: '/health' });
    await app.register(widgetsRoutes);

    // DB
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/widgets');

    const port = Number(process.env.PORT || 5000);
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Backend listening on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
