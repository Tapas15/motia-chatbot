import { ApiRouteConfig, ApiRequest, FlowContext } from 'motia';
import { z } from 'zod';

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'HealthCheck',
  description: 'Health check endpoint for the application',
  method: 'GET',
  path: '/',
  responseSchema: {
    200: z.object({
      status: z.string(),
      timestamp: z.string(),
      service: z.string(),
      version: z.string(),
    }),
  },
  emits: [],
  flows: ['chat'],
};

export const handler = async (
  req: ApiRequest,
  ctx: FlowContext
) => {
  ctx.logger.info('Health check requested');
  
  return {
    status: 200,
    body: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'streaming-ai-chatbot',
      version: '1.0.0',
    },
  };
};

export default config;
