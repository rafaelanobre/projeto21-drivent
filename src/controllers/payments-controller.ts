import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentsService } from '@/services/payments-service';

export async function getTicketPayment(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const ticketId = Number(req.query.ticketId);

  const payment = await paymentsService.getTicketPayment(userId, ticketId);
  res.status(httpStatus.OK).send(payment);
}

export async function postPaymentProcess(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const payment = await paymentsService.postPaymentProcess(userId, req.body);
  res.status(httpStatus.OK).send(payment);
}
