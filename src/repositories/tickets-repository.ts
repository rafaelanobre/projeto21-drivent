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

export const ticketRepository = {
  getTicketTypes,
  getUserTicket,
  ticketPost,
};
