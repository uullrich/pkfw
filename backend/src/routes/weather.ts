import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { getWeatherByLocation } from '../services/weatherService';

const weatherRoutes: FastifyPluginAsync = async (app) => {
  // GET /weather?location=Berlin
  const querySchema = z.object({
    location: z.string().min(1),
  });

  app.get('/weather', async (req, res) => {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.badRequest('location query param is required');
    }
    const data = await getWeatherByLocation(parsed.data.location);
    if (!data) {
      return res.notFound('No weather data found for location');
    }
    return data;
  });
};

export default weatherRoutes;
