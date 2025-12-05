# Backend Integration & API Documentation

This document outlines how to integrate the frontend with backend APIs and the expected contracts for each endpoint.

## Overview

The frontend is designed to work with a REST API backend. All API calls go through a centralized `apiClient` that handles:

- Request/response transformation
- Automatic retry with exponential backoff
- Authentication token management
- Timeout handling
- Error normalization

## API Configuration

Set environment variables to configure API endpoints:

```bash
# .env.local
VITE_API_URL=http://localhost:3001/api
VITE_BACKEND_AUTH=true
VITE_BACKEND_PIPELINE_DATA=true
VITE_BACKEND_SERVICE_REQUESTS=true
VITE_BACKEND_ENERGY_MONITORING=true
```

## Authentication API

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "tech@example.com",
  "password": "password123",
  "language": "English"
}

Response (200 OK):
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user-1",
    "name": "Tech Name",
    "email": "tech@example.com",
    "role": "technician",
    "scheme": "Scheme-001"
  }
}
```

### Logout

```
POST /api/auth/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true
}
```

### Get Profile

```
GET /api/auth/profile
Authorization: Bearer {token}

Response (200 OK):
{
  "user": { ... }
}
```

### Refresh Token

```
POST /api/auth/refresh
Authorization: Bearer {token}

Response (200 OK):
{
  "token": "eyJhbGc..."
}
```

## Pipeline & Sensor APIs

### Get Pipelines

```
GET /api/pipelines?scheme=Scheme-001
Authorization: Bearer {token}

Response (200 OK):
{
  "pipelines": [
    {
      "id": "pipeline-1",
      "name": "Main Distribution",
      "length": 45.2,
      "diameter": 200,
      "pressure": 2.8,
      "status": "normal"
    }
  ]
}
```

### Get Sensor Data

```
GET /api/schemes/{schemeId}/sensors/data
Authorization: Bearer {token}

Response (200 OK):
{
  "sensors": [
    {
      "id": "sensor-1",
      "type": "Pressure",
      "location": "Ward 3",
      "value": 2.8,
      "unit": "bar",
      "battery": 92,
      "lastSeen": "2025-11-27T10:30:00Z"
    }
  ]
}
```

### Control Valve

```
POST /api/valves/{valveId}/control
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "OPEN",
  "metadata": {
    "reason": "Maintenance",
    "operator": "tech-1"
  }
}

Response (200 OK):
{
  "id": "valve-1",
  "action": "OPEN",
  "timestamp": "2025-11-27T10:35:00Z"
}
```

## Service Request APIs

### Create Service Request

```
POST /api/service-requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Pump not starting",
  "description": "Primary pump fails to start",
  "priority": "HIGH",
  "category": "Equipment",
  "attachments": []
}

Response (201 Created):
{
  "id": "sr-1",
  "title": "Pump not starting",
  "status": "OPEN",
  "createdAt": "2025-11-27T10:40:00Z"
}
```

### Get Service Requests

```
GET /api/service-requests?status=OPEN&priority=HIGH
Authorization: Bearer {token}

Response (200 OK):
{
  "requests": [
    {
      "id": "sr-1",
      "title": "Pump not starting",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2025-11-27T10:40:00Z"
    }
  ]
}
```

### Update Request Status

```
PATCH /api/service-requests/{requestId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "notes": "Investigating issue"
}

Response (200 OK):
{
  "id": "sr-1",
  "status": "IN_PROGRESS",
  "updatedAt": "2025-11-27T10:45:00Z"
}
```

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2025-11-27T10:45:00Z"
}
```

Common error codes:

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `408` - Request Timeout
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable

## Authentication Flow

1. User submits credentials → `POST /api/auth/login`
2. Backend returns JWT token and user data
3. Frontend stores token in localStorage
4. All subsequent requests include `Authorization: Bearer {token}` header
5. On token expiration, frontend calls `POST /api/auth/refresh`
6. On logout, frontend removes token and clears user context

## Using the API Client

### Basic Usage

```javascript
import { apiClient } from './api/apiClient';

// GET request
const response = await apiClient.get('/pipelines');
console.log(response.data);

// POST request
const response = await apiClient.post('/service-requests', {
  title: 'Issue',
  description: 'Description',
});

// Set auth token
apiClient.setAuthToken(token);

// Clear auth token
apiClient.clearAuthToken();
```

### Using Service Classes

```javascript
import AuthService from './api/authService';
import PipelineService from './api/pipelineService';
import ServiceRequestService from './api/serviceRequestService';

// Login
const response = await AuthService.login('email@example.com', 'password', 'English');

// Get sensor data
const response = await PipelineService.getSensorData('scheme-id');

// Create service request
const response = await ServiceRequestService.createRequest({
  title: 'Issue',
  description: 'Details',
});
```

## Feature Flags for Backend Integration

Control backend features via environment variables:

```bash
# Enable authentication integration
VITE_BACKEND_AUTH=true

# Enable pipeline data integration
VITE_BACKEND_PIPELINE_DATA=true

# Enable service requests integration
VITE_BACKEND_SERVICE_REQUESTS=true

# Enable energy monitoring integration
VITE_BACKEND_ENERGY_MONITORING=true
```

Check in components:

```javascript
import { isFeatureEnabled } from './api/featureFlags';

if (isFeatureEnabled('BACKEND_AUTH')) {
  // Use real auth APIs
}
```

## Testing with Mock API

For frontend-only development, use Mock Service Worker:

```bash
VITE_USE_MSW=true npm run dev
```

This intercepts all API calls and returns mock data. Update `src/api/mswSetup.js` to add more mock responses.

## Migration Checklist

- [ ] Backend authentication API implemented
- [ ] Sensor data API implemented
- [ ] Service request API implemented
- [ ] Energy monitoring API implemented
- [ ] CORS headers configured on backend
- [ ] Rate limiting implemented
- [ ] Input validation on backend
- [ ] Error handling standardized
- [ ] API documentation updated
- [ ] Feature flags enabled in .env.production
- [ ] Integration tests passing
- [ ] Load testing completed
- [ ] Security audit completed

## Support

For API integration issues, refer to:

- Backend repository documentation
- API specification document
- OpenAPI/Swagger specification (if available)
