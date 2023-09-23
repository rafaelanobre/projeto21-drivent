import Joi from 'joi';

//TODO: Tipar essa parte
export const createTicketSchema = Joi.object({
    ticketTypeId: Joi.number().integer().positive().required()
});
