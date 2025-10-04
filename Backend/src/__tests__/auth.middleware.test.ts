import jwt from 'jsonwebtoken';
import {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  JWTPayload
} from '../middleware/auth.middleware';

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

describe('Auth Middleware', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload: JWTPayload = {
        id: 1,
        username: 'testuser',
        role: 'user'
      };

      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload: JWTPayload = {
        id: 1,
        username: 'testuser',
        role: 'user'
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded).not.toBeNull();
      expect(decoded!.id).toBe(1);
      expect(decoded!.username).toBe('testuser');
      expect(decoded!.role).toBe('user');
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifyToken(invalidToken);
      
      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      // Create a token with very short expiry
      const payload: JWTPayload = {
        id: 1,
        username: 'testuser',
        role: 'user'
      };

      const token = jwt.sign(payload, 'test-secret-key', { expiresIn: '1ms' });
      
      // Wait a bit to ensure token expires
      setTimeout(() => {
        const decoded = verifyToken(token);
        expect(decoded).toBeNull();
      }, 10);
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testpassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      
      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hash = await hashPassword(password);
      
      const isMatch = await comparePassword(wrongPassword, hash);
      expect(isMatch).toBe(false);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hash = await hashPassword(password);
      
      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });
  });
});
