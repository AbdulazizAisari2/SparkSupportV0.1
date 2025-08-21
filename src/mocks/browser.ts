import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Add debugging
worker.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});