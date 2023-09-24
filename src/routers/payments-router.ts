import { Router } from 'express';
import { getTicketPayment, postPaymentProcess } from '@/controllers/payments-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentProcessSchema } from '@/schemas/payments-schema';

const paymentsRouter = Router();

paymentsRouter
  .get('/', authenticateToken, getTicketPayment)
  .post('/process', authenticateToken, validateBody(paymentProcessSchema), postPaymentProcess);

export { paymentsRouter };
