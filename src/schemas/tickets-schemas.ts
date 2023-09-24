import { CreateTicket } from '@/protocols';
import Joi from 'joi';

export const createTicketSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().integer().positive().required(),
});
