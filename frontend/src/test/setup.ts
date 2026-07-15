import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../mocks/node.js';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
