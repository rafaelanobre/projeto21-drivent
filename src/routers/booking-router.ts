import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getUserBooking, newBooking, updateBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getUserBooking)
  .post('/', newBooking)
  .put('/:bookingId', updateBooking);

export { bookingRouter };
