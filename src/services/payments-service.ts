import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { CreatePayment } from '@/protocols';
import { paymentsRepository } from '@/repositories/payments-repository';
import { ticketRepository } from '@/repositories/tickets-repository';

async function getTicketPayment(userId: number, ticketId: number) {
  if (!ticketId) throw invalidDataError('ticket id');
  const ticket = await ticketRepository.getTicketById(ticketId);
  if (!ticket) throw notFoundError();
  if (userId !== ticket.Enrollment.userId) throw unauthorizedError();

  const payment = await paymentsRepository.getTicketPayment(ticketId);
  return payment;
}

async function postPaymentProcess(userId: number, body: CreatePayment) {
  const ticket = await ticketRepository.getTicketById(body.ticketId);
  if (!ticket) throw notFoundError();
  if (userId !== ticket.Enrollment.userId) throw unauthorizedError();

  const payment = await paymentsRepository.postPaymentProcess(body, ticket.TicketType.price);

  await ticketRepository.updatePaidTicket(body.ticketId);

  return payment;
}

export const paymentsService = {
  getTicketPayment,
  postPaymentProcess,
};
