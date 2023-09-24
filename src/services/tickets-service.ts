import { notFoundError } from '@/errors';
import { enrollmentRepository } from '@/repositories';
import { ticketRepository } from '@/repositories/tickets-repository';

async function getTicketTypes() {
  return await ticketRepository.getTicketTypes();
}

async function getUserTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.getUserTicket(userId);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function ticketPost(ticketTypeId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  return await ticketRepository.ticketPost(ticketTypeId, enrollment.id);
}

export const ticketService = {
  getTicketTypes,
  getUserTicket,
  ticketPost,
};
