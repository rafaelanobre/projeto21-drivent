import Joi from 'joi';
import { CreatePayment } from '@/protocols';

export const paymentProcessSchema = Joi.object<CreatePayment>({
  ticketId: Joi.number().integer().positive().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.string().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.string().required(),
  }).required(),
});
