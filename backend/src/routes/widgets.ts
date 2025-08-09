import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { listWidgets, createWidget, deleteWidgetById } from '../controllers/widgetsController';
import { getWeatherByLocation } from '../services/weatherService';

const widgetsRoutes: FastifyPluginAsync = async (app) => {
  // GET /widgets
  app.get('/widgets', async (_req, _res) => {
    const widgets = await listWidgets();
    return widgets;
  });

  // POST /widgets
  const createBodySchema = z.object({
    location: z.string().min(1, 'location is required'),
  });

  app.post('/widgets', async (req, res) => {
    const parsed = createBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.errors.map((e) => e.message).join(', '));
    }
    const { location } = parsed.data;
    const widget = await createWidget(location);
    res.code(201);
    return widget;
  });

  // DELETE /widgets/:id
  const paramsSchema = z.object({
    id: z.string().min(1),
  });

  app.delete('/widgets/:id', async (req, res) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.badRequest('Invalid id');
    }
    const deleted = await deleteWidgetById(parsed.data.id);
    if (!deleted) {
      return res.notFound('Widget not found');
    }
    return { ok: true };
  });

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

export default widgetsRoutes;
