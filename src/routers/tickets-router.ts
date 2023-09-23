import { getTicket, getTicketTypes, ticketPost } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketSchema } from "@/schemas/tickets-schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
    .get('/tickets/types', authenticateToken, getTicketTypes)
    .get('/tickets', authenticateToken, getTicket)
    .post('/tickets', authenticateToken, validateBody(createTicketSchema) ,ticketPost)

export { ticketsRouter };