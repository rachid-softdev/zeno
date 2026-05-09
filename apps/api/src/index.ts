import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import 'dotenv/config';

import { workspaceRoutes } from './routes/workspaces.js';
import { agentRoutes } from './routes/agents.js';
import { templateRoutes } from './routes/templates.js';
import { workflowRoutes } from './routes/workflows.js';
import { chatRoutes } from './routes/chat.js';
import { inboxRoutes } from './routes/inbox.js';
import { brainRoutes } from './routes/brain.js';
import { analyticsRoutes } from './routes/analytics.js';

const PORT = parseInt(process.env.PORT || '3001', 10);
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'dev-secret-change-me';

export async function buildServer() {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss' },
      },
    },
  });

  // Plugins
  await app.register(cors, { origin: true, credentials: true });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  await app.register(jwt, { secret: JWT_SECRET });

  // Auth decorator
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ success: false, error: 'Unauthorized' });
    }
  });

  // Health check
  app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Routes
  await app.register(workspaceRoutes, { prefix: '/api/workspaces' });
  await app.register(agentRoutes, { prefix: '/api/agents' });
  await app.register(templateRoutes, { prefix: '/api/templates' });
  await app.register(workflowRoutes, { prefix: '/api/workflows' });
  await app.register(chatRoutes, { prefix: '/api/chat' });
  await app.register(inboxRoutes, { prefix: '/api/inbox' });
  await app.register(brainRoutes, { prefix: '/api/brain' });
  await app.register(analyticsRoutes, { prefix: '/api/analytics' });

  // Structured error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(error.statusCode || 500).send({
      success: false,
      error: error.message || 'Internal server error',
    });
  });

  return app;
}

// Start server
const start = async () => {
  const app = await buildServer();
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`\n🚀 Zeno API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
