import { prisma } from '@/config';
import { TicketStatus } from '@prisma/client';

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
      status: TicketStatus.RESERVED
    }
  });

  const ticketType = await prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
    },
  });

  const ticketResponse = {
    id: ticket.id,
    status: ticket.status.toString(),
    ticketTypeId: ticket.ticketTypeId,
    enrollmentId: ticket.enrollmentId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    TicketType: ticketType,
  };

  return ticketResponse;
}

export const ticketRepository = {
  getTicketTypes,
  getUserTicket,
  ticketPost,
};
