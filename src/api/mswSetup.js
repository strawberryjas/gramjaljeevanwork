/**
 * Mock Service Worker (MSW) Setup
 * Intercepts API calls during development and testing.
 * Provides mock responses before backend is ready.
 */

import { setupWorker, rest } from 'msw';

// Mock data
const mockUser = {
  id: 'user-1',
  name: 'Demo Technician',
  email: 'tech@example.com',
  role: 'technician',
  scheme: 'Scheme-001',
};

const mockPipelines = [
  {
    id: 'pipeline-1',
    name: 'Main Distribution Ring',
    length: 45.2,
    diameter: 200,
    pressure: 2.8,
    status: 'normal',
  },
  {
    id: 'pipeline-2',
    name: 'Secondary Feed',
    length: 12.5,
    diameter: 150,
    pressure: 1.5,
    status: 'warning',
  },
];

const mockSensors = [
  {
    id: 'sensor-1',
    type: 'Pressure',
    location: 'Ward 3',
    value: 2.8,
    unit: 'bar',
    battery: 92,
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'sensor-2',
    type: 'Flow',
    location: 'Ward 5',
    value: 420,
    unit: 'L/min',
    battery: 68,
    lastSeen: new Date().toISOString(),
  },
];

const mockServiceRequests = [
  {
    id: 'sr-1',
    title: 'Pump not starting',
    description: 'Primary pump fails to start',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sr-2',
    title: 'Pressure drop at Ward 5',
    description: 'Low pressure readings',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
  },
];

// Mock API handlers
export const handlers = [
  // Authentication
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
      })
    );
  }),

  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ success: true }));
  }),

  rest.get('/api/auth/profile', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ user: mockUser }));
  }),

  // Pipelines
  rest.get('/api/pipelines', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ pipelines: mockPipelines }));
  }),

  rest.get('/api/pipelines/:id', (req, res, ctx) => {
    const { id } = req.params;
    const pipeline = mockPipelines.find(p => p.id === id);
    return res(
      ctx.status(pipeline ? 200 : 404),
      ctx.json(pipeline || { error: 'Pipeline not found' })
    );
  }),

  // Sensors
  rest.get('/api/sensors/:id/data', (req, res, ctx) => {
    const { id } = req.params;
    const sensor = mockSensors.find(s => s.id === id);
    return res(
      ctx.status(sensor ? 200 : 404),
      ctx.json(sensor || { error: 'Sensor not found' })
    );
  }),

  rest.get('/api/schemes/:schemeId/sensors/data', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ sensors: mockSensors }));
  }),

  // Service Requests
  rest.post('/api/service-requests', (req, res, ctx) => {
    const newRequest = {
      id: 'sr-' + Date.now(),
      ...req.body,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    return res(ctx.status(201), ctx.json(newRequest));
  }),

  rest.get('/api/service-requests', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ requests: mockServiceRequests }));
  }),

  rest.get('/api/service-requests/:id', (req, res, ctx) => {
    const { id } = req.params;
    const request = mockServiceRequests.find(r => r.id === id);
    return res(
      ctx.status(request ? 200 : 404),
      ctx.json(request || { error: 'Request not found' })
    );
  }),

  rest.patch('/api/service-requests/:id/status', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({ id, status: req.body.status, updatedAt: new Date().toISOString() })
    );
  }),
];

// Setup the worker
export const worker = setupWorker(...handlers);

// Start worker in development/testing only
if (process.env.NODE_ENV === 'development' || process.env.VITE_USE_MSW === 'true') {
  worker.start({
    onUnhandledRequest: 'warn', // Log unhandled requests
  });
}
