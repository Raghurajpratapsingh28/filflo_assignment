import request from 'supertest';
import app from '../index';

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

describe('API Endpoints', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('Authentication', () => {
    describe('POST /api/login', () => {
      it('should return 400 for missing fields', async () => {
        await request(app)
          .post('/api/login')
          .send({
            username: 'testuser'
          })
          .expect(400);
      });
    });
  });
});