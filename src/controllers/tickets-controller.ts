import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { invalidDataError } from '@/errors';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketService } from '@/services/tickets-service';

export async function getTicketTypes(req: Request, res: Response) {
  const ticketTypes = await ticketService.getTicketTypes();

  return res.status(httpStatus.OK).send(ticketTypes);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const ticket = await ticketService.getUserTicket(userId);

  return res.status(httpStatus.OK).send(ticket);
}

export async function ticketPost(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const ticketTypeId = req.body.ticketTypeId;
  if (!ticketTypeId) throw invalidDataError('Invalid ticket type');
  const ticket = await ticketService.ticketPost(ticketTypeId, userId);

  res.status(httpStatus.CREATED).send(ticket);
}
