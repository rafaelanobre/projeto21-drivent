import { prisma } from '@/config';
import { CreatePayment } from '@/protocols';

async function getTicketPayment(ticketId: number) {
  const payment = await prisma.payment.findUnique({ where: { ticketId: ticketId } });
  return payment;
}

async function postPaymentProcess(data: CreatePayment, price: number) {
  const payment = await prisma.payment.create({
    data: {
      ticketId: data.ticketId,
      value: price,
      cardIssuer: data.cardData.issuer,
      cardLastDigits: data.cardData.number.slice(-4),
    },
    select: {
      id: true,
      ticketId: true,
      value: true,
      cardIssuer: true,
      cardLastDigits: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return payment;
}

export const paymentsRepository = {
  getTicketPayment,
  postPaymentProcess,
};
