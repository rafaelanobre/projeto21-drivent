import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketTypes() {
  return prisma.ticketType.findMany();
}

async function getUserTicket(userId: number) {
  return prisma.ticket.findFirst({
    include: {
      TicketType: true,
    },
    where: { Enrollment: { userId: userId } },
  });
}

async function ticketPost(ticketTypeId: number, enrollmentId: number) {
  const ticket = await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: TicketStatus.RESERVED,
    },
  });

  return ticket;
}

async function getTicketById(ticketId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId },
    include: {
      TicketType: true,
      Enrollment: true,
    },
  });
  return ticket;
}

async function updatePaidTicket(ticketId: number) {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: 'PAID' },
  });
}

export const ticketRepository = {
  getTicketTypes,
  getUserTicket,
  ticketPost,
  getTicketById,
  updatePaidTicket,
};
