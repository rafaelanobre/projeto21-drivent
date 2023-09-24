import { Router } from 'express';
import { getTicket, getTicketTypes, ticketPost } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .get('/types', authenticateToken, getTicketTypes)
  .get('/', authenticateToken, getTicket)
  .post('/', authenticateToken, validateBody(createTicketSchema), ticketPost);

export { ticketsRouter };
